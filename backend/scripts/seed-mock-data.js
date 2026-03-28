require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const {
  sequelize,
  syncModelsInOrder,
  User,
  Post,
  Story,
  Reel,
  Conversation,
  Message,
  Notification,
  Call,
  UserFollowers,
  UserCloseFriends
} = require('../src/models');

const args = new Set(process.argv.slice(2));
const append = args.has('--append');
const reset = args.has('--reset') || !append;

const makeDate = (minutesAgo) => new Date(Date.now() - minutesAgo * 60 * 1000);
const makeStoryExpiry = () => {
  const expiryHours = parseInt(process.env.STORY_EXPIRY_HOURS, 10) || 24;
  return new Date(Date.now() + expiryHours * 60 * 60 * 1000);
};

const run = async () => {
  try {
    console.log('🔄 Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Connection established');

    await syncModelsInOrder();

    if (reset) {
      console.log('⚠️  Reset mode enabled. Truncating all tables...');
      await sequelize.truncate({ cascade: true, restartIdentity: true });
    }

    const alex = await User.create({
      username: 'alex_connectme',
      email: 'alex@connectme.app',
      phone: '+15550000001',
      password: 'Pass@123',
      fullName: 'Alex Carter',
      bio: 'Building memories one post at a time.',
      isEmailVerified: true,
      isPhoneVerified: true,
      isOnline: true
    });

    const maya = await User.create({
      username: 'maya_connectme',
      email: 'maya@connectme.app',
      phone: '+15550000002',
      password: 'Pass@123',
      fullName: 'Maya Singh',
      bio: 'Coffee, travel, and reels.',
      isEmailVerified: true,
      isPhoneVerified: true,
      isOnline: true
    });

    await alex.update({
      couplePartnerId: maya.id,
      coupleStatus: 'coupled',
      anniversaryDate: new Date('2024-02-14T00:00:00.000Z')
    });

    await maya.update({
      couplePartnerId: alex.id,
      coupleStatus: 'coupled',
      anniversaryDate: new Date('2024-02-14T00:00:00.000Z')
    });

    await UserFollowers.create({ followerId: maya.id, followingId: alex.id });
    await UserCloseFriends.create({ userId: alex.id, closeFriendId: maya.id });

    const post = await Post.create({
      userId: alex.id,
      caption: 'Sunset walk with my favorite person ❤️',
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2'
        }
      ],
      likes: [maya.id],
      likesCount: 1,
      comments: [
        {
          id: uuidv4(),
          userId: maya.id,
          text: 'Perfect evening ✨',
          createdAt: new Date().toISOString()
        }
      ],
      commentsCount: 1,
      hashtags: ['connectme', 'couplegoals']
    });

    const reel = await Reel.create({
      userId: maya.id,
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      caption: 'Weekend highlights 🎬',
      likes: [alex.id],
      comments: [
        {
          id: uuidv4(),
          userId: alex.id,
          text: 'This edit is amazing!',
          createdAt: new Date().toISOString()
        }
      ],
      viewsCount: 128
    });

    await Story.create({
      userId: alex.id,
      media: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
        }
      ],
      caption: 'Beach day 🌊',
      views: [maya.id],
      viewsCount: 1,
      expiresAt: makeStoryExpiry()
    });

    const conversation = await Conversation.create({
      participants: [alex.id, maya.id],
      isCouple: true,
      name: 'Alex & Maya',
      unreadCount: {
        [alex.id]: 0,
        [maya.id]: 0
      }
    });

    const message = await Message.create({
      conversationId: conversation.id,
      senderId: alex.id,
      messageType: 'text',
      text: 'Dinner at 8?',
      status: 'read',
      deliveredTo: [maya.id],
      readBy: [maya.id]
    });

    await conversation.update({
      lastMessageId: message.id,
      lastMessageAt: message.createdAt
    });

    await Notification.create({
      recipientId: maya.id,
      senderId: alex.id,
      type: 'like_post',
      postId: post.id,
      isRead: false
    });

    await Notification.create({
      recipientId: alex.id,
      senderId: maya.id,
      type: 'like_reel',
      reelId: reel.id,
      isRead: true,
      readAt: new Date()
    });

    await Call.create({
      callerId: alex.id,
      receiverId: maya.id,
      callType: 'video',
      status: 'completed',
      duration: 420,
      startedAt: makeDate(20),
      endedAt: makeDate(13)
    });

    console.log('✅ Mock data seeded successfully');
    console.log('📌 Seeded users: alex_connectme / maya_connectme');
    console.log('📌 Default password for both users: Pass@123');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Mock data seeding failed:', error.message);
    await sequelize.close();
    process.exit(1);
  }
};

run();
