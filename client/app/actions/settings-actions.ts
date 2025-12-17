'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSettingsAction() {
    try {
        const settings = db.prepare('SELECT * FROM Settings LIMIT 1').get() as any;
        if (!settings) {
            // Return defaults if no settings found
            return {
                theme: 'system',
                language: 'en',
                currency: 'USD',
                companyName: 'My Shop',
            };
        }
        return settings;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSettingsAction(data: any) {
    try {
        const existing = db.prepare('SELECT id FROM Settings LIMIT 1').get() as any;

        if (existing) {
            const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(data), existing.id];
            db.prepare(`UPDATE Settings SET ${setClause} WHERE id = ?`).run(...values);
        } else {
            const columns = Object.keys(data).join(', ');
            const placeholders = Object.keys(data).map(() => '?').join(', ');
            db.prepare(`INSERT INTO Settings (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}

export async function resetDatabaseAction() {
    try {
        // Disable foreign key constraints
        db.pragma('foreign_keys = OFF');

        const tables = [
            'Translation', 'Warehouse', 'Location', 'StockMovement', 'StockQuant',
            'Category', 'Product', 'Customer', 'Order', 'OrderItem',
            'Account', 'JournalEntry', 'JournalItem', 'Invoice', 'InvoiceItem',
            'Supplier', 'PurchaseInvoice', 'PurchaseInvoiceItem', 'RFQ', 'RFQItem',
            'PurchaseOrder', 'PurchaseOrderItem', 'PurchaseReceipt', 'PurchaseReceiptItem',
            'Lead', 'Opportunity', 'Activity', 'Ticket', 'Note',
            'Department', 'Employee', 'Attendance', 'LeaveApplication', 'Payroll', 'ExpenseClaim',
            'BOM', 'BOMItem', 'WorkStation', 'ProductionOrder', 'JobCard',
            'MaterialRequest', 'MaterialRequestItem', 'Project', 'Task', 'Timesheet',
            'Cart', 'CartItem', 'WebPage', 'WebForm', 'WebFormSubmission', 'AuditLog'
        ];

        for (const table of tables) {
            try {
                const check = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table);
                if (check) {
                    db.prepare(`DELETE FROM "${table}"`).run();
                }
            } catch (err) {
                console.warn(`Failed to clear table ${table}:`, err);
            }
        }

        // Special handling for User table - preserve Admin
        try {
            db.prepare(`DELETE FROM User WHERE email != 'admin@example.com'`).run();
        } catch (err) {
            console.warn('Failed to clear Users:', err);
        }

        db.pragma('foreign_keys = ON');

        revalidatePath('/');
        return { success: true, message: 'Database cleared successfully' };
    } catch (error) {
        console.error('Error resetting database:', error);
        return { success: false, message: 'Failed to reset database' };
    }
}
