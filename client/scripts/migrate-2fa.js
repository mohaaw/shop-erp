const Database = require('better-sqlite3');
const path = require('path');

// This script is run from client/, so prisma/shop.db is at ./prisma/shop.db
// The failed attempt used ../prisma/shop.db which was wrong for 'node scripts/migrate-2fa.ts'
// Wait, if I run from 'client/', and script is in 'client/scripts/', 
// then __dirname is 'client/scripts'.
// So path should be path.join(__dirname, '../prisma/shop.db').
// But the previous error 'no such table: User' implies it opened a NEW EMPTY db at that path because the file didn't exist there.
// If the DB is at /home/thedevil/shop-erp/client/prisma/shop.db
// And we are in /home/thedevil/shop-erp/client/scripts
// Then ../prisma/shop.db is correct.
// LET'S TRY ABSOLUTE PATH TO BE SAFE.
const dbPath = path.join(process.cwd(), 'dev.db');

console.log('DB Path:', dbPath);
const db = new Database(dbPath);

console.log('Migrating User table to support 2FA...');

try {
    // Add twoFactorEnabled
    try {
        db.prepare('ALTER TABLE User ADD COLUMN twoFactorEnabled BOOLEAN DEFAULT 0').run();
        console.log('Added twoFactorEnabled column');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('twoFactorEnabled column already exists');
        } else {
            console.error('Error adding twoFactorEnabled:', e.message);
        }
    }

    // Add twoFactorSecret
    try {
        db.prepare('ALTER TABLE User ADD COLUMN twoFactorSecret TEXT').run();
        console.log('Added twoFactorSecret column');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('twoFactorSecret column already exists');
        } else {
            console.error('Error adding twoFactorSecret:', e.message);
        }
    }

    // Add backupCodes
    try {
        db.prepare('ALTER TABLE User ADD COLUMN backupCodes TEXT').run();
        console.log('Added backupCodes column');
    } catch (e) {
        if (e.message.includes('duplicate column name')) {
            console.log('backupCodes column already exists');
        } else {
            console.error('Error adding backupCodes:', e.message);
        }
    }

    console.log('Migration completed.');
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
