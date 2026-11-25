import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

// Neon PostgreSQL Connection String provided by user
const NEON_DB_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_RgnIhfPN4M2i@ep-nameless-poetry-behd5cnq-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require';

export const pool = new Pool({
  connectionString: NEON_DB_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Initialize database schema in Neon PostgreSQL
export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('[Neon DB] Connecting to PostgreSQL database...');

    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        salt VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. User sessions table (for token management)
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        token VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Password resets table (for 6-digit verification code)
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        email VARCHAR(255) PRIMARY KEY,
        code VARCHAR(10) NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ [Neon DB] PostgreSQL schema initialized successfully (users, sessions, password_resets tables ready)!');
  } catch (err) {
    console.error('❌ [Neon DB] Database initialization error:', err.message);
  } finally {
    client.release();
  }
}
