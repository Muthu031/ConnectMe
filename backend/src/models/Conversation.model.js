const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Conversation extends Model {}

Conversation.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  participants: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  isCouple: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  coupleEmoji: {
    type: DataTypes.STRING(10),
    defaultValue: '💑'
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  lastMessageId: {
    type: DataTypes.UUID,
    allowNull: true
    // No foreign key constraint to avoid circular dependency
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  unreadCount: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  typingUsers: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  mutedBy: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  archivedBy: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'Conversation',
  tableName: 'conversations',
  timestamps: true,
  indexes: [
    { fields: ['participants'], using: 'gin' },
    { fields: ['lastMessageAt'] },
    { fields: ['isCouple'] }
  ],
  hooks: {
    beforeSave: (conversation) => {
      if (conversation.isCouple && conversation.participants.length !== 2) {
        throw new Error('Couple chat must have exactly 2 participants');
      }
    }
  }
});

module.exports = Conversation;
