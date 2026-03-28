const Message = require('../models/Message.model');
const Conversation = require('../models/Conversation.model');
const User = require('../models/User.model');
const Call = require('../models/Call.model');

// Store active connections
const activeUsers = new Map();

/**
 * Initialize Socket.IO
 */
const initializeSocketIO = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // User authentication and join
    socket.on('user_online', async (userId) => {
      try {
        socket.userId = userId;
        activeUsers.set(userId, socket.id);

        // Update user status in database
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date()
        });

        // Notify friends that user is online
        socket.broadcast.emit('user_status_changed', {
          userId,
          isOnline: true
        });

        console.log(`User ${userId} is online`);
      } catch (error) {
        console.error('User online error:', error);
      }
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, senderId, text, messageType, media, replyTo } = data;

        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          text,
          messageType: messageType || 'text',
          media,
          replyTo,
          status: 'sent'
        });

        await message.populate('sender', 'username profilePicture');

        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastMessageAt: new Date()
        });

        // Emit to conversation room
        io.to(`conversation:${conversationId}`).emit('message_received', message);

        // Send delivery confirmation
        socket.emit('message_sent', {
          tempId: data.tempId,
          message
        });

        console.log(`Message sent in conversation ${conversationId}`);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', {
          tempId: data.tempId,
          error: error.message
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { conversationId, userId } = data;
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        conversationId,
        userId
      });
    });

    // Stop typing indicator
    socket.on('stop_typing', (data) => {
      const { conversationId, userId } = data;
      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        conversationId,
        userId
      });
    });

    // Message read
    socket.on('message_read', async (data) => {
      try {
        const { messageId, userId } = data;

        await Message.findByIdAndUpdate(messageId, {
          status: 'read',
          $push: {
            readBy: {
              user: userId,
              readAt: new Date()
            }
          }
        });

        const message = await Message.findById(messageId);
        io.to(`conversation:${message.conversation}`).emit('message_status_updated', {
          messageId,
          status: 'read',
          userId
        });
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    // Video/Audio Call Signaling
    socket.on('call_user', async (data) => {
      try {
        const { callerId, receiverId, callType, offer } = data;

        // Create call record
        const call = await Call.create({
          caller: callerId,
          receiver: receiverId,
          callType,
          status: 'ringing'
        });

        const receiverSocketId = activeUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('incoming_call', {
            callId: call._id,
            callerId,
            callType,
            offer
          });
        } else {
          // User is offline, send notification
          socket.emit('call_failed', {
            reason: 'User is offline'
          });
        }
      } catch (error) {
        console.error('Call user error:', error);
      }
    });

    // Call accepted
    socket.on('call_accepted', async (data) => {
      try {
        const { callId, answer } = data;

        await Call.findByIdAndUpdate(callId, {
          status: 'ongoing',
          startedAt: new Date()
        });

        const call = await Call.findById(callId);
        const callerSocketId = activeUsers.get(call.caller.toString());

        if (callerSocketId) {
          io.to(callerSocketId).emit('call_accepted', {
            callId,
            answer
          });
        }
      } catch (error) {
        console.error('Call accepted error:', error);
      }
    });

    // Call rejected
    socket.on('call_rejected', async (data) => {
      try {
        const { callId } = data;

        await Call.findByIdAndUpdate(callId, {
          status: 'rejected',
          endedAt: new Date()
        });

        const call = await Call.findById(callId);
        const callerSocketId = activeUsers.get(call.caller.toString());

        if (callerSocketId) {
          io.to(callerSocketId).emit('call_rejected', { callId });
        }
      } catch (error) {
        console.error('Call rejected error:', error);
      }
    });

    // Call ended
    socket.on('call_ended', async (data) => {
      try {
        const { callId } = data;

        const call = await Call.findById(callId);
        const duration = Math.floor((Date.now() - call.startedAt) / 1000);

        await Call.findByIdAndUpdate(callId, {
          status: 'completed',
          endedAt: new Date(),
          duration
        });

        // Notify other participant
        const otherUserId = call.caller.toString() === socket.userId 
          ? call.receiver.toString() 
          : call.caller.toString();
        
        const otherSocketId = activeUsers.get(otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit('call_ended', { callId });
        }
      } catch (error) {
        console.error('Call ended error:', error);
      }
    });

    // WebRTC ICE candidates
    socket.on('ice_candidate', (data) => {
      const { receiverId, candidate } = data;
      const receiverSocketId = activeUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('ice_candidate', {
          senderId: socket.userId,
          candidate
        });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.id}`);

      if (socket.userId) {
        // Update user status
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date()
        });

        // Notify friends that user is offline
        socket.broadcast.emit('user_status_changed', {
          userId: socket.userId,
          isOnline: false,
          lastSeen: new Date()
        });

        activeUsers.delete(socket.userId);
      }
    });
  });
};

module.exports = { initializeSocketIO, activeUsers };
