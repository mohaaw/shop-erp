const Database = require('better-sqlite3');
const path = require('path');

// Use environment variable for DB path or fallback to default relative path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../client/dev.db');

const db = new Database(DB_PATH, {
    // Only log in development and not in test/production to reduce noise
    verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

db.pragma('journal_mode = WAL');

module.exports = db;
