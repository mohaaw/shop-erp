
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'dev.db');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

function getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Creates a backup of the SQLite database using the VACUUM INTO command (safe for online backups)
 * or falls back to file copy if not possible.
 */
export async function backupDatabase() {
    const timestamp = getTimestamp();
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.db`);

    console.log(`Starting backup of ${DB_PATH} to ${backupFile}...`);

    try {
        // Try using sqlite3 command line for safer hot backup if available
        try {
            execSync(`sqlite3 "${DB_PATH}" ".backup '${backupFile}'"`);
            console.log('Backup created successfully using sqlite3 .backup command');
        } catch (e) {
            console.log('sqlite3 command failed or not found, falling back to file copy. This may not be safe if DB is under heavy write load.');
            fs.copyFileSync(DB_PATH, backupFile);
            // Also copy WAL and SHM if they exist
            if (fs.existsSync(`${DB_PATH}-wal`)) fs.copyFileSync(`${DB_PATH}-wal`, `${backupFile}-wal`);
            if (fs.existsSync(`${DB_PATH}-shm`)) fs.copyFileSync(`${DB_PATH}-shm`, `${backupFile}-shm`);
        }

        // Rotation Logic
        rotateBackups();

        return { success: true, path: backupFile };
    } catch (error) {
        console.error('Backup failed:', error);
        return { success: false, error };
    }
}

function rotateBackups() {
    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup-') && f.endsWith('.db'))
        .map(f => ({
            name: f,
            path: path.join(BACKUP_DIR, f),
            time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // Newest first

    // Keep last 10 backups
    const dataToKeep = 10;

    if (files.length > dataToKeep) {
        const toDelete = files.slice(dataToKeep);
        toDelete.forEach(file => {
            console.log(`Rotating old backup: ${file.name}`);
            try {
                fs.unlinkSync(file.path);
                if (fs.existsSync(`${file.path}-wal`)) fs.unlinkSync(`${file.path}-wal`);
                if (fs.existsSync(`${file.path}-shm`)) fs.unlinkSync(`${file.path}-shm`);
            } catch (e) {
                console.error(`Failed to delete ${file.name}`, e);
            }
        });
    }
}

// Allow running directly
if (require.main === module) {
    backupDatabase();
}
