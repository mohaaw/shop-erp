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
            primaryColor: string;
            secondaryColor: string;
        } | undefined;

        if (!settings) {
            // Create default settings if not exists
            const id = Math.random().toString(36).substring(7);
            const now = new Date().toISOString();
            db.prepare(`
        INSERT INTO Settings (id, storeName, currency, timezone, primaryColor, secondaryColor, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, 'ERP-SHOP', 'usd', 'utc', '#3B82F6', '#64748B', now);

            return {
                storeName: 'ERP-SHOP',
                currency: 'usd',
                timezone: 'utc',
                supportEmail: null,
                primaryColor: '#3B82F6',
                secondaryColor: '#64748B'
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
    primaryColor?: string;
    secondaryColor?: string;
}) {
    try {
        const now = new Date().toISOString();

        // Check if settings exist
        const existing = db.prepare('SELECT id FROM Settings LIMIT 1').get() as { id: string } | undefined;

        if (existing) {
            db.prepare(`
        UPDATE Settings 
        SET storeName = ?, supportEmail = ?, currency = ?, timezone = ?, primaryColor = ?, secondaryColor = ?, updatedAt = ?
        WHERE id = ?
      `).run(data.storeName, data.supportEmail || null, data.currency, data.timezone, data.primaryColor || '#3B82F6', data.secondaryColor || '#64748B', now, existing.id);
        } else {
            const id = Math.random().toString(36).substring(7);
            db.prepare(`
        INSERT INTO Settings (id, storeName, supportEmail, currency, timezone, primaryColor, secondaryColor, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, data.storeName, data.supportEmail || null, data.currency, data.timezone, data.primaryColor || '#3B82F6', data.secondaryColor || '#64748B', now);
        }

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
