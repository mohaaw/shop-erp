'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSettingsAction() {
    try {
        const settings = db.prepare('SELECT * FROM Settings LIMIT 1').get() as {
            id: string;
            storeName: string;
            supportEmail: string | null;
            currency: string;
            timezone: string;
        } | undefined;

        if (!settings) {
            // Create default settings if not exists
            const id = Math.random().toString(36).substring(7);
            const now = new Date().toISOString();
            db.prepare(`
        INSERT INTO Settings (id, storeName, currency, timezone, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, 'ERP-SHOP', 'usd', 'utc', now);

            return {
                storeName: 'ERP-SHOP',
                currency: 'usd',
                timezone: 'utc',
                supportEmail: null
            };
        }

        return settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export async function updateSettingsAction(data: {
    storeName: string;
    supportEmail?: string;
    currency: string;
    timezone: string;
}) {
    try {
        const now = new Date().toISOString();

        // Check if settings exist
        const existing = db.prepare('SELECT id FROM Settings LIMIT 1').get() as { id: string } | undefined;

        if (existing) {
            db.prepare(`
        UPDATE Settings 
        SET storeName = ?, supportEmail = ?, currency = ?, timezone = ?, updatedAt = ?
        WHERE id = ?
      `).run(data.storeName, data.supportEmail || null, data.currency, data.timezone, now, existing.id);
        } else {
            const id = Math.random().toString(36).substring(7);
            db.prepare(`
        INSERT INTO Settings (id, storeName, supportEmail, currency, timezone, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, data.storeName, data.supportEmail || null, data.currency, data.timezone, now);
        }

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
