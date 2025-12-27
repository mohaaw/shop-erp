import "server-only";
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    password?: string;
    avatar?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    backupCodes?: string;
}

export const userService = {
    // ... existing methods ...

    updateTwoFactorSecret: (userId: string, secret: string | null, enabled: boolean) => {
        const stmt = db.prepare('UPDATE User SET twoFactorSecret = ?, twoFactorEnabled = ? WHERE id = ?');
        stmt.run(secret, enabled ? 1 : 0, userId);
    },

    updateBackupCodes: (userId: string, codes: string[]) => {
        const stmt = db.prepare('UPDATE User SET backupCodes = ? WHERE id = ?');
        stmt.run(JSON.stringify(codes), userId);
    },

    createUser: async (name: string, email: string, password: string) => {
        const id = randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 'user', ?, ?)
        `);

        stmt.run(id, name, email, hashedPassword, now, now);
        return userService.getUserById(id);
    },

    verifyPassword: async (password: string, hash: string) => {
        // console.log('userService.verifyPassword called');
        const result = await bcrypt.compare(password, hash);
        return result;
    },

    getUserById: (id: string): User | null => {
        return db.prepare('SELECT * FROM User WHERE id = ?').get(id) as User | null;
    },

    getUserByEmail: (email: string): User | null => {
        return db.prepare('SELECT * FROM User WHERE email = ?').get(email) as User | null;
    },

    getUserByEmailWithPassword: (email: string): User | null => {
        return db.prepare('SELECT * FROM User WHERE email = ?').get(email) as User | null;
    },

    updateProfile: (id: string, data: { name: string; email: string; bio?: string; avatar?: string }) => {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            UPDATE User 
            SET name = ?, email = ?, bio = ?, avatar = ?, updatedAt = ?
            WHERE id = ?
        `);
        stmt.run(data.name, data.email, data.bio || null, data.avatar || null, now, id);
        return userService.getUserById(id);
    }
};
