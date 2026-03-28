const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Story extends Model {}

Story.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  media: {
    type: DataTypes.JSON,
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING(200),
    validate: {
      len: {
        args: [0, 200],
        msg: 'Caption cannot exceed 200 characters'
      }
    }
  },
  views: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  visibility: {
    type: DataTypes.ENUM('public', 'followers', 'close-friends', 'couples-only'),
    defaultValue: 'public'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Story',
  tableName: 'stories',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'createdAt'] },
    { fields: ['expiresAt'] },
    { fields: ['isActive'] }
  ],
  hooks: {
    beforeCreate: (story) => {
      const expiryHours = parseInt(process.env.STORY_EXPIRY_HOURS) || 24;
      story.expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    }
  }
});

module.exports = Story;
