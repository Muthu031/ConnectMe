const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Message extends Model {}

Message.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'conversations',
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
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'video', 'audio', 'file', 'location', 'contact'),
    defaultValue: 'text'
  },
  text: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 5000],
        msg: 'Message cannot exceed 5000 characters'
      }
    }
  },
  media: {
    type: DataTypes.JSON,
    allowNull: true
  },
  replyToId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read'),
    defaultValue: 'sent'
  },
  readBy: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  deliveredTo: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deletedFor: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  reactions: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages',
  timestamps: true,
  indexes: [
    { fields: ['conversationId', 'createdAt'] },
    { fields: ['senderId'] },
    { fields: ['status'] }
  ]
});

module.exports = Message;
