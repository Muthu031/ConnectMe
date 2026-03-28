const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Notification extends Model {}

Notification.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.ENUM(
      'follow',
      'like_post',
      'like_reel',
      'comment_post',
      'comment_reel',
      'mention_post',
      'mention_comment',
      'story_view',
      'message',
      'call_missed',
      'couple_request',
      'couple_accepted',
      'anniversary_reminder'
    ),
    allowNull: false
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'posts',
      key: 'id'
    }
  },
  reelId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'reels',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  storyId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'stories',
      key: 'id'
    }
  },
  messageId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id'
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['recipientId', 'createdAt'] },
    { fields: ['recipientId', 'isRead'] },
    { fields: ['reelId'] },
    { fields: ['type'] }
  ]
});

module.exports = Notification;
