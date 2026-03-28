require('dotenv').config();

const { sequelize, syncModelsInOrder } = require('../src/models');

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const alter = args.has('--alter');
const drop = args.has('--drop');

if (force && alter) {
  console.error('❌ Use either --force or --alter, not both.');
  process.exit(1);
}

const run = async () => {
  try {
    console.log('🔄 Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Connection established');

    if (drop) {
      console.log('⚠️  Dropping all tables before migration...');
      await sequelize.drop({ cascade: true });
    }

    const syncOptions = { force, alter };
    console.log(`🔄 Running migrations with options: ${JSON.stringify(syncOptions)}`);

    await syncModelsInOrder(syncOptions);

    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('✅ Migration completed');
    console.log('📋 Tables in database:');
    tables.forEach((table, index) => console.log(`   ${index + 1}. ${table}`));

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await sequelize.close();
    process.exit(1);
  }
};

run();
