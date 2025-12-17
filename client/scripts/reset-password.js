const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Connect to DB
const dbPath = path.join(__dirname, '../dev.db');
console.log('Connecting to DB at:', dbPath);
const db = new Database(dbPath);

async function resetPassword() {
    const email = 'admin@example.com';
    const password = 'password123';

    console.log(`Resetting password for ${email} to '${password}'...`);

    const hash = await bcrypt.hash(password, 10);

    const stmt = db.prepare('UPDATE User SET password = ? WHERE email = ?');
    const info = stmt.run(hash, email);

    if (info.changes > 0) {
        console.log('✅ Password updated successfully!');
    } else {
        console.log('❌ User not found!');
    }
}

resetPassword();
