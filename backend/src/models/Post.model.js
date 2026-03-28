const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Post extends Model {}

Post.init({
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
  media: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  likes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  saves: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  savesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  shares: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  sharesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  hashtags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  visibility: {
    type: DataTypes.ENUM('public', 'followers', 'close-friends', 'couples-only'),
    defaultValue: 'public'
  },
  commentsDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  hideLikesCount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'posts',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'createdAt'] },
    { fields: ['createdAt'] },
    { fields: ['visibility'] },
    { fields: ['hashtags'], using: 'gin' }
  ]
});

module.exports = Post;
