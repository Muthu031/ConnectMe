/**
 * Database Initialization Script for PostgreSQL
 * 
 * This script initializes the PostgreSQL database and creates all tables
 * Run this script to set up your database for the first time
 */

require('dotenv').config();
const { sequelize, syncModelsInOrder } = require('./src/models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    console.log('\n🔄 Creating database tables...');
    
    // Sync models in deterministic order to avoid relation creation issues
    await syncModelsInOrder({
      force: process.env.DB_FORCE_SYNC === 'true',
      alter: process.env.DB_ALTER_SYNC === 'true'
    });
    
    console.log('✅ All tables created successfully');
    console.log('\n📊 Database schema initialized!');
    
    // Display created tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('\n📋 Created tables:');
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table}`);
    });
    
    console.log('\n🎉 Database initialization complete!');
    console.log('\nYou can now start your server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database credentials in .env are correct');
    console.error('3. Database "connectme" exists (create it if needed)');
    console.error('\nTo create the database, run:');
    console.error('   psql -U postgres -c "CREATE DATABASE connectme;"');
    
    process.exit(1);
  }
};

// Run the initialization
initializeDatabase();
