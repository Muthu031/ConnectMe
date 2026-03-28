import { io, Socket } from 'socket.io-client';
import { store } from '../redux/store';
import { addMessage, updateMessageStatus } from '../redux/slices/chatSlice';
import { addNotification } from '../redux/slices/notificationSlice';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
    const userId = store.getState().auth.user?._id;
    if (userId) {
      socket?.emit('user_online', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  // Chat events
  socket.on('message_received', (message) => {
    store.dispatch(addMessage(message));
  });

  socket.on('message_status_updated', ({ messageId, status }) => {
    store.dispatch(updateMessageStatus({ messageId, status }));
  });

  socket.on('user_typing', ({ conversationId, userId }) => {
    // Handle typing indicator
    console.log(`User ${userId} is typing in conversation ${conversationId}`);
  });

  // Notification events
  socket.on('new_notification', (notification) => {
    store.dispatch(addNotification(notification));
  });

  // Call events
  socket.on('incoming_call', (callData) => {
    // Handle incoming call
    console.log('Incoming call:', callData);
  });

  socket.on('call_accepted', (data) => {
    console.log('Call accepted:', data);
  });

  socket.on('call_rejected', (data) => {
    console.log('Call rejected:', data);
  });

  socket.on('call_ended', (data) => {
    console.log('Call ended:', data);
  });

  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const joinConversation = (conversationId: string) => {
  if (socket) {
    socket.emit('join_conversation', conversationId);
  }
};

export const leaveConversation = (conversationId: string) => {
  if (socket) {
    socket.emit('leave_conversation', conversationId);
  }
};

export const sendMessage = (messageData: any) => {
  if (socket) {
    socket.emit('send_message', messageData);
  }
};

export const sendTypingIndicator = (conversationId: string, userId: string) => {
  if (socket) {
    socket.emit('typing', { conversationId, userId });
  }
};

export const stopTypingIndicator = (conversationId: string, userId: string) => {
  if (socket) {
    socket.emit('stop_typing', { conversationId, userId });
  }
};

export const markMessageAsRead = (messageId: string, userId: string) => {
  if (socket) {
    socket.emit('message_read', { messageId, userId });
  }
};

// Call functions
export const initiateCall = (callData: any) => {
  if (socket) {
    socket.emit('call_user', callData);
  }
};

export const acceptCall = (callId: string, answer: any) => {
  if (socket) {
    socket.emit('call_accepted', { callId, answer });
  }
};

export const rejectCall = (callId: string) => {
  if (socket) {
    socket.emit('call_rejected', { callId });
  }
};

export const endCall = (callId: string) => {
  if (socket) {
    socket.emit('call_ended', { callId });
  }
};

export const sendICECandidate = (receiverId: string, candidate: any) => {
  if (socket) {
    socket.emit('ice_candidate', { receiverId, candidate });
  }
};

export const getSocket = () => socket;
