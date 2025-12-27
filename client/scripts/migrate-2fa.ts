const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/shop.db');
// The script is in /client/scripts, so ../prisma/shop.db maps to /client/prisma/shop.db
// However, the error said "SqliteError: no such table: User".
// This implies it opened *a* database, but not the *right* one (or it was empty).
// Let's print the resolved path.
console.log('DB Path:', dbPath);
const db = new Database(dbPath);

console.log('Migrating User table to support 2FA...');

try {
    // Add twoFactorEnabled
    try {
        db.prepare('ALTER TABLE User ADD COLUMN twoFactorEnabled BOOLEAN DEFAULT 0').run();
        console.log('Added twoFactorEnabled column');
    } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
            console.log('twoFactorEnabled column already exists');
        } else {
            throw e;
        }
    }

    // Add twoFactorSecret
    try {
        db.prepare('ALTER TABLE User ADD COLUMN twoFactorSecret TEXT').run();
        console.log('Added twoFactorSecret column');
    } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
            console.log('twoFactorSecret column already exists');
        } else {
            throw e;
        }
    }

    // Add backupCodes
    try {
        db.prepare('ALTER TABLE User ADD COLUMN backupCodes TEXT').run();
        console.log('Added backupCodes column');
    } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
            console.log('backupCodes column already exists');
        } else {
            throw e;
        }
    }

    console.log('Migration completed successfully.');
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
