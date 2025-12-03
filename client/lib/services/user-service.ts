import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const userService = {
    createUser: async (name: string, email: string, password: string): Promise<User> => {
        const existingUser = db.prepare('SELECT id FROM User WHERE email = ?').get(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, 'user', ?, ?)
        `);

        stmt.run(id, name, email, hashedPassword, now, now);

        return {
            id,
            name,
            email,
            role: 'user',
            createdAt: now,
            updatedAt: now
        };
    },

    getUserByEmail: async (email: string): Promise<User | null> => {
        const user = db.prepare('SELECT * FROM User WHERE email = ?').get(email) as User | undefined;
        return user || null;
    },

    verifyPassword: async (password: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(password, hash);
    }
};
