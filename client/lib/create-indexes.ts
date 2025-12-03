import { db } from './db';

/**
 * Create database indexes for performance optimization
 * Run this after database initialization
 */
export function createIndexes() {
    console.log('Creating database indexes...');

    // Product indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_product_sku ON Product(sku)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_product_barcode ON Product(barcode)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_product_category ON Product(categoryId)').run();

    // Order indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_order_customer ON "Order"(customerId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_order_date ON "Order"(createdAt)').run();

    // Invoice indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_invoice_customer ON Invoice(customerId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_invoice_status ON Invoice(status)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_invoice_date ON Invoice(date)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_invoice_number ON Invoice(number)').run();

    // Purchase Invoice indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_purchase_invoice_supplier ON PurchaseInvoice(supplierId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_purchase_invoice_status ON PurchaseInvoice(status)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_purchase_invoice_date ON PurchaseInvoice(date)').run();

    // Journal Entry indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_journal_entry_date ON JournalEntry(date)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_journal_entry_status ON JournalEntry(status)').run();

    // Journal Item indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_journal_item_entry ON JournalItem(journalEntryId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_journal_item_account ON JournalItem(accountId)').run();

    // Stock indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_stock_quant_product ON StockQuant(productId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_stock_quant_location ON StockQuant(locationId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_stock_movement_product ON StockMovement(productId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_stock_movement_date ON StockMovement(date)').run();

    // Employee indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_employee_number ON Employee(employeeNumber)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_employee_department ON Employee(departmentId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_employee_status ON Employee(status)').run();

    // Attendance indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_attendance_employee ON Attendance(employeeId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_attendance_date ON Attendance(date)').run();

    // Lead indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_lead_status ON Lead(status)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_lead_email ON Lead(email)').run();

    // Opportunity indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_opportunity_stage ON Opportunity(stage)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_opportunity_customer ON Opportunity(customerId)').run();

    // Audit Log indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_audit_log_user ON AuditLog(userId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON AuditLog(entity, entityId)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON AuditLog(timestamp)').run();

    console.log('Database indexes created successfully.');
}
