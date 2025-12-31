import "server-only";
import { db } from '@/lib/db';
import { Category } from '@/types/product';
import { v4 as uuidv4 } from 'uuid';

export const CategoryService = {
    getCategories: (): Category[] => {
        return db.prepare('SELECT * FROM Category ORDER BY name').all() as Category[];
    },

    getCategory: (id: string): Category | undefined => {
        return db.prepare('SELECT * FROM Category WHERE id = ?').get(id) as Category | undefined;
    },

    createCategory: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Category (id, name, slug, description, image, parentId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.name,
            data.slug,
            data.description || null,
            data.image || null,
            data.parentId || null,
            now,
            now
        );

        return { id, ...data, createdAt: now, updatedAt: now };
    },

    updateCategory: (id: string, data: Partial<Category>): Category => {
        const now = new Date().toISOString();
        const fields = Object.keys(data).map((key) => `${key} = ?`).join(', ');
        const values = Object.values(data);

        const stmt = db.prepare(`
            UPDATE Category SET ${fields}, updatedAt = ? WHERE id = ?
        `);

        stmt.run(...values, now, id);

        return db.prepare('SELECT * FROM Category WHERE id = ?').get(id) as Category;
    },

    deleteCategory: (id: string): void => {
        db.prepare('DELETE FROM Category WHERE id = ?').run(id);
    }
};
