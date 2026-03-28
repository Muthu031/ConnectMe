const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Reel extends Model {}

Reel.init({
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
  videoUrl: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  caption: {
    type: DataTypes.TEXT,
    defaultValue: '',
    validate: {
      len: {
        args: [0, 2200],
        msg: 'Caption cannot exceed 2200 characters'
      }
    }
  },
  likes: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  comments: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Reel',
  tableName: 'reels',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'createdAt'] },
    { fields: ['createdAt'] },
    { fields: ['viewsCount'] }
  ]
});

module.exports = Reel;
