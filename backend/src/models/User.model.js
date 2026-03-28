const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
  // Instance method to compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Hide sensitive data
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    delete values.refreshToken;
    delete values.otp;
    return values;
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Username is required' },
      len: {
        args: [3, 30],
        msg: 'Username must be between 3 and 30 characters'
      },
      is: {
        args: /^[a-zA-Z0-9_.]+$/,
        msg: 'Username can only contain letters, numbers, underscores, and dots'
      }
    },
    set(value) {
      this.setDataValue('username', value.toLowerCase().trim());
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Email is required' },
      isEmail: { msg: 'Please provide a valid email' }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    set(value) {
      this.setDataValue('phone', value ? value.trim() : null);
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' },
      len: {
        args: [6, 255],
        msg: 'Password must be at least 6 characters'
      }
    }
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    set(value) {
      this.setDataValue('fullName', value ? value.trim() : null);
    }
  },
  bio: {
    type: DataTypes.STRING(200),
    defaultValue: '',
    validate: {
      len: {
        args: [0, 200],
        msg: 'Bio cannot exceed 200 characters'
      }
    }
  },
  profilePicture: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  coverPicture: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  website: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Couple Partner ID  
  couplePartnerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  anniversaryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  coupleStatus: {
    type: DataTypes.ENUM('single', 'pending', 'coupled'),
    defaultValue: 'single'
  },
  // Device tokens stored as JSON
  deviceTokens: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Online status
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // OTP verification stored as JSON
  otp: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Refresh token
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Account stats
  postsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  followersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  followingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['username'] },
    { fields: ['email'] },
    { fields: ['phone'] },
    { fields: ['isOnline'] },
    { fields: ['couplePartnerId'] }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;
