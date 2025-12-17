import { db } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

console.log('🌱 Starting database seeding...');

const seedData = async () => {
    try {
        const now = new Date().toISOString();
        const yesterday = new Date(Date.now() - 86400000).toISOString();
        const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString();
        const lastMonth = new Date(Date.now() - 30 * 86400000).toISOString();

        // 1. Seed Categories
        console.log('📦 Seeding Categories...');
        const categories = [
            { id: uuidv4(), name: 'Electronics' },
            { id: uuidv4(), name: 'Clothing' },
            { id: uuidv4(), name: 'Home & Garden' },
        ];
        const categoryStmt = db.prepare('INSERT OR IGNORE INTO Category (id, name) VALUES (?, ?)');
        categories.forEach(c => categoryStmt.run(c.id, c.name));

        // 2. Seed Products
        console.log('🛍️  Seeding Products...');
        const products = [
            { id: uuidv4(), name: 'Smartphone X', price: 999.00, cost: 700.00, stock: 50, categoryId: categories[0].id },
            { id: uuidv4(), name: 'Laptop Pro', price: 1499.00, cost: 1000.00, stock: 20, categoryId: categories[0].id },
            { id: uuidv4(), name: 'Wireless Earbuds', price: 199.00, cost: 80.00, stock: 100, categoryId: categories[0].id },
            { id: uuidv4(), name: 'Designer T-Shirt', price: 49.00, cost: 15.00, stock: 200, categoryId: categories[1].id },
            { id: uuidv4(), name: 'Jeans Classic', price: 89.00, cost: 30.00, stock: 150, categoryId: categories[1].id },
            { id: uuidv4(), name: 'Coffee Maker', price: 79.00, cost: 40.00, stock: 30, categoryId: categories[2].id },
        ];
        const productStmt = db.prepare('INSERT OR IGNORE INTO Product (id, name, price, cost, categoryId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
        products.forEach(p => productStmt.run(p.id, p.name, p.price, p.cost, p.categoryId, now, now));

        // 3. Seed Customers
        console.log('👥 Seeding Customers...');
        const customers = [
            { id: uuidv4(), name: 'John Doe', email: 'john@example.com', phone: '555-0101' },
            { id: uuidv4(), name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102' },
            { id: uuidv4(), name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0103' },
            { id: uuidv4(), name: 'Bob Brown', email: 'bob@example.com', phone: '555-0104' },
        ];
        const customerStmt = db.prepare('INSERT OR IGNORE INTO Customer (id, name, email, phone, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
        customers.forEach(c => customerStmt.run(c.id, c.name, c.email, c.phone, now, now));

        // 4. Seed Orders (to generate revenue stats)
        console.log('💰 Seeding Orders...');
        const orders = [
            { id: uuidv4(), customerId: customers[0].id, total: 1048.00, status: 'completed', createdAt: now },
            { id: uuidv4(), customerId: customers[1].id, total: 299.00, status: 'completed', createdAt: yesterday },
            { id: uuidv4(), customerId: customers[2].id, total: 1599.00, status: 'completed', createdAt: lastWeek },
            { id: uuidv4(), customerId: customers[3].id, total: 49.00, status: 'pending', createdAt: now },
            { id: uuidv4(), customerId: customers[0].id, total: 89.00, status: 'completed', createdAt: lastMonth },
        ];
        const orderStmt = db.prepare('INSERT OR IGNORE INTO "Order" (id, customerId, total, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
        orders.forEach(o => orderStmt.run(o.id, o.customerId, o.total, o.status, o.createdAt, o.createdAt));

        // 5. Seed CRM Data (Leads & Tickets)
        console.log('🎫 Seeding CRM Data...');
        const leads = [
            { id: uuidv4(), firstName: 'Michael', lastName: 'Scott', status: 'new', company: 'Paper Co' },
            { id: uuidv4(), firstName: 'Dwight', lastName: 'Schrute', status: 'qualified', company: 'Beet Farm' },
        ];
        const leadStmt = db.prepare('INSERT OR IGNORE INTO Lead (id, firstName, lastName, status, company, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
        leads.forEach(l => leadStmt.run(l.id, l.firstName, l.lastName, l.status, l.company, now, now));

        const tickets = [
            { id: uuidv4(), customerId: customers[0].id, subject: 'Login Issue', description: 'Cannot login', priority: 'high', status: 'open' },
            { id: uuidv4(), customerId: customers[1].id, subject: 'Refund Request', description: 'Product damaged', priority: 'medium', status: 'in_progress' },
        ];
        const ticketStmt = db.prepare('INSERT OR IGNORE INTO Ticket (id, customerId, subject, description, priority, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        tickets.forEach(t => ticketStmt.run(t.id, t.customerId, t.subject, t.description, t.priority, t.status, now, now));

        // 6. Seed Employees
        console.log('👷 Seeding Employees...');
        const employees = [
            { id: uuidv4(), firstName: 'Pam', lastName: 'Beesly', email: 'pam@shop.com', designation: 'Receptionist', employeeNumber: 'EMP001' },
            { id: uuidv4(), firstName: 'Jim', lastName: 'Halpert', email: 'jim@shop.com', designation: 'Sales Rep', employeeNumber: 'EMP002' },
        ];
        const employeeStmt = db.prepare('INSERT OR IGNORE INTO Employee (id, firstName, lastName, email, designation, employeeNumber, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        employees.forEach(e => employeeStmt.run(e.id, e.firstName, e.lastName, e.email, e.designation, e.employeeNumber, now, now));

        console.log('✅ Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
