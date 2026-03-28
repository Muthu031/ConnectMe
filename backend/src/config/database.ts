/**
 * Database Configuration with Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

let pool: Pool | null = null;
let db: NodePgDatabase<typeof schema> | null = null;

/**
 * Initialize database connection
 */
export const initializeDB = async (): Promise<NodePgDatabase<typeof schema>> => {
  try {
    if (pool && db) {
      return db;
    }

    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'connectme',
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 30000
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ PostgreSQL connected successfully with Drizzle');

    db = drizzle(pool, { schema });
    return db;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  }
};

/**
 * Get database instance
 */
export const getDB = (): NodePgDatabase<typeof schema> => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDB() first.');
  }
  return db;
};

/**
 * Close database connection
 */
export const closeDB = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
};
