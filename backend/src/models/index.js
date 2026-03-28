const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Import all models
const User = require('./User.model');
const Post = require('./Post.model');
const Story = require('./Story.model');
const Reel = require('./Reel.model');
const Message = require('./Message.model');
const Conversation = require('./Conversation.model');
const Notification = require('./Notification.model');
const Call = require('./Call.model');

// Define relationships

// User relationships
User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Story, { foreignKey: 'userId', as: 'stories', onDelete: 'CASCADE' });
Story.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Reel, { foreignKey: 'userId', as: 'reels', onDelete: 'CASCADE' });
Reel.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reel.hasMany(Notification, { foreignKey: 'reelId', as: 'notifications', onDelete: 'SET NULL' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Notification, { foreignKey: 'recipientId', as: 'receivedNotifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

User.hasMany(Notification, { foreignKey: 'senderId', as: 'sentNotifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

User.hasMany(Call, { foreignKey: 'callerId', as: 'callerCalls', onDelete: 'CASCADE' });
Call.belongsTo(User, { foreignKey: 'callerId', as: 'caller' });

User.hasMany(Call, { foreignKey: 'receiverId', as: 'receiverCalls', onDelete: 'CASCADE' });
Call.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Couple relationship (self-referencing)
User.belongsTo(User, { foreignKey: 'couplePartnerId', as: 'couplePartner' });

// Conversation relationships
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// Note: lastMessage relationship commented out to avoid circular dependency
// Conversation.belongsTo(Message, { foreignKey: 'lastMessageId', as: 'lastMessage' });

// Message reply relationship (self-referencing)
Message.belongsTo(Message, { foreignKey: 'replyToId', as: 'replyToMessage' });

// Notification relationships
Notification.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Notification.belongsTo(Reel, { foreignKey: 'reelId', as: 'reel' });
Notification.belongsTo(Story, { foreignKey: 'storyId', as: 'story' });
Notification.belongsTo(Message, { foreignKey: 'messageId', as: 'message' });

// Create junction tables for many-to-many relationships

// Followers relationship
const UserFollowers = sequelize.define('user_followers', {
  followerId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  followingId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['followerId'] },
    { fields: ['followingId'] },
    { unique: true, fields: ['followerId', 'followingId'] }
  ]
});

// Blocked users relationship
const UserBlocked = sequelize.define('user_blocked', {
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  blockedUserId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { unique: true, fields: ['userId', 'blockedUserId'] }
  ]
});

// Close friends relationship
const UserCloseFriends = sequelize.define('user_close_friends', {
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  closeFriendId: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { unique: true, fields: ['userId', 'closeFriendId'] }
  ]
});

// Define many-to-many associations


User.belongsToMany(User, { 
  through: UserFollowers,
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

User.belongsToMany(User, {
  through: UserFollowers,
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});

User.belongsToMany(User, {
  through: UserBlocked,
  as: 'blockedUsers',
  foreignKey: 'userId',
  otherKey: 'blockedUserId'
});

User.belongsToMany(User, {
  through: UserCloseFriends,
  as: 'closeFriends',
  foreignKey: 'userId',
  otherKey: 'closeFriendId'
});

// Export all models
const syncModelsInOrder = async (syncOptions = {}) => {
  const orderedModels = [
    User,
    Post,
    Story,
    Reel,
    Conversation,
    Message,
    Notification,
    Call,
    UserFollowers,
    UserBlocked,
    UserCloseFriends
  ];

  for (const model of orderedModels) {
    await model.sync(syncOptions);
  }
};

module.exports = {
  sequelize,
  User,
  Post,
  Story,
  Reel,
  Message,
  Conversation,
  Notification,
  Call,
  UserFollowers,
  UserBlocked,
  UserCloseFriends,
  syncModelsInOrder
};
