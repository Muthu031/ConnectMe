const { Sequelize } = require('sequelize');

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'connectme',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected successfully');
    
    // Sync all models with database (creates tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      const { syncModelsInOrder } = require('../models');
      await syncModelsInOrder({ alter: true });
      console.log('✅ Database synchronized');
    }

    return sequelize;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
