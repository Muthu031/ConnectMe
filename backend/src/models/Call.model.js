const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Call extends Model {}

Call.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  callerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  callType: {
    type: DataTypes.ENUM('audio', 'video'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ringing', 'ongoing', 'completed', 'missed', 'rejected', 'cancelled'),
    defaultValue: 'ringing'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Duration in seconds'
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Call',
  tableName: 'calls',
  timestamps: true,
  indexes: [
    { fields: ['callerId', 'createdAt'] },
    { fields: ['receiverId', 'createdAt'] },
    { fields: ['status'] }
  ]
});

module.exports = Call;
