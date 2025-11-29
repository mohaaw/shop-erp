import { db } from './lib/db';

console.log('Running Phase 2 DB Migration...');

try {
    // Add minStock column
    try {
        db.prepare('ALTER TABLE Product ADD COLUMN minStock REAL DEFAULT 0').run();
        console.log('Added minStock column.');
    } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
            console.log('minStock column already exists.');
        } else {
            console.error('Error adding minStock:', e);
        }
    }

    // Add images column
    try {
        db.prepare('ALTER TABLE Product ADD COLUMN images TEXT').run();
        console.log('Added images column.');
    } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
            console.log('images column already exists.');
        } else {
            console.error('Error adding images:', e);
        }
    }

    console.log('Migration completed successfully.');
} catch (error) {
    console.error('Migration failed:', error);
}
