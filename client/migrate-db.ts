import { db } from './lib/db';

const migrations = [
    `ALTER TABLE Product ADD COLUMN brand TEXT;`,
    `ALTER TABLE Product ADD COLUMN model TEXT;`,
    `ALTER TABLE Product ADD COLUMN specifications TEXT;`,
    `ALTER TABLE Product ADD COLUMN warranty TEXT;`
];

console.log('Starting migration...');

migrations.forEach((query) => {
    try {
        db.exec(query);
        console.log(`Executed: ${query}`);
    } catch (error: any) {
        if (error.message.includes('duplicate column name')) {
            console.log(`Skipped (already exists): ${query}`);
        } else {
            console.error(`Failed: ${query}`, error);
        }
    }
});

console.log('Migration complete.');
