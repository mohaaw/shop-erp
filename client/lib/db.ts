import 'server-only';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'dev.db');
console.log('DB Initializing at:', dbPath);

const db = new Database(dbPath, {
    // Only log in development
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
});
db.pragma('journal_mode = WAL');

export { db };

