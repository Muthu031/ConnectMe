import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '5432';
const database = process.env.DB_NAME || 'connectme';
const user = process.env.DB_USER || 'user';
const password = process.env.DB_PASSWORD || 'password';
const ssl = process.env.DB_SSL === 'true';

const sslPart = ssl ? '?sslmode=require' : '';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: `postgresql://${user}:${password}@${host}:${port}/${database}${sslPart}`,
  },
  verbose: true,
  strict: true,
});
