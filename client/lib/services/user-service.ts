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
}

export const userService = {
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
        return bcrypt.compare(password, hash);
    },

    getUserById: (id: string): User | null => {
        return db.prepare('SELECT id, name, email, role, avatar, bio, createdAt, updatedAt FROM User WHERE id = ?').get(id) as User | null;
    },

    getUserByEmail: (email: string): User | null => {
        return db.prepare('SELECT id, name, email, role, avatar, bio, createdAt, updatedAt FROM User WHERE email = ?').get(email) as User | null;
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
