import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status: string;
    score: number;
    assignedTo?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Opportunity {
    id: string;
    name: string;
    customerId?: string;
    leadId?: string;
    stage: string;
    expectedRevenue: number;
    probability: number;
    expectedCloseDate?: string;
    assignedTo?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Activity {
    id: string;
    leadId?: string;
    customerId?: string;
    type: string;
    subject: string;
    description?: string;
    date: string;
    status: string;
    leadName?: string;
    customerName?: string;
}

export interface SupportTicket {
    id: string;
    customerId: string;
    subject: string;
    description: string;
    priority: string;
    status: string;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
    customerName?: string;
}

export const crmService = {
    // Lead methods
    getLeads(): Lead[] {
        const stmt = db.prepare('SELECT * FROM Lead ORDER BY createdAt DESC');
        return stmt.all() as Lead[];
    },

    getLeadById(id: string): Lead | null {
        const stmt = db.prepare('SELECT * FROM Lead WHERE id = ?');
        return stmt.get(id) as Lead | null;
    },

    createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Lead (
                id, firstName, lastName, email, phone, company,
                source, status, score, assignedTo, notes,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.firstName,
            data.lastName,
            data.email || null,
            data.phone || null,
            data.company || null,
            data.source || null,
            data.status || 'new',
            data.score || 0,
            data.assignedTo || null,
            data.notes || null,
            now,
            now
        );

        return this.getLeadById(id)!;
    },

    updateLead(id: string, data: Partial<Lead>): Lead {
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            UPDATE Lead 
            SET firstName = ?, lastName = ?, email = ?, phone = ?,
                company = ?, source = ?, status = ?, score = ?,
                assignedTo = ?, notes = ?, updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(
            data.firstName,
            data.lastName,
            data.email || null,
            data.phone || null,
            data.company || null,
            data.source || null,
            data.status,
            data.score,
            data.assignedTo || null,
            data.notes || null,
            now,
            id
        );

        return this.getLeadById(id)!;
    },

    deleteLead(id: string): void {
        const stmt = db.prepare('DELETE FROM Lead WHERE id = ?');
        stmt.run(id);
    },

    // Opportunity methods
    getOpportunities(): Opportunity[] {
        const stmt = db.prepare('SELECT * FROM Opportunity ORDER BY createdAt DESC');
        return stmt.all() as Opportunity[];
    },

    getOpportunityById(id: string): Opportunity | null {
        const stmt = db.prepare('SELECT * FROM Opportunity WHERE id = ?');
        return stmt.get(id) as Opportunity | null;
    },

    createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Opportunity {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Opportunity (
                id, name, customerId, leadId, stage, expectedRevenue,
                probability, expectedCloseDate, assignedTo, notes,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.name,
            data.customerId || null,
            data.leadId || null,
            data.stage || 'qualification',
            data.expectedRevenue || 0,
            data.probability || 0,
            data.expectedCloseDate || null,
            data.assignedTo || null,
            data.notes || null,
            now,
            now
        );

        return this.getOpportunityById(id)!;
    },

    updateOpportunity(id: string, data: Partial<Opportunity>): Opportunity {
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            UPDATE Opportunity 
            SET name = ?, customerId = ?, leadId = ?, stage = ?,
                expectedRevenue = ?, probability = ?, expectedCloseDate = ?,
                assignedTo = ?, notes = ?, updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(
            data.name,
            data.customerId || null,
            data.leadId || null,
            data.stage,
            data.expectedRevenue,
            data.probability,
            data.expectedCloseDate || null,
            data.assignedTo || null,
            data.notes || null,
            now,
            id
        );

        return this.getOpportunityById(id)!;
    },

    deleteOpportunity(id: string): void {
        const stmt = db.prepare('DELETE FROM Opportunity WHERE id = ?');
        stmt.run(id);
    },

    // Activity methods
    getActivities(): Activity[] {
        return db.prepare(`
            SELECT a.*, l.firstName || ' ' || l.lastName as leadName, c.name as customerName
            FROM Activity a
            LEFT JOIN Lead l ON a.leadId = l.id
            LEFT JOIN Customer c ON a.customerId = c.id
            ORDER BY a.date DESC
        `).all() as Activity[];
    },

    createActivity(data: Omit<Activity, 'id' | 'leadName' | 'customerName'>): Activity {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO Activity (id, leadId, customerId, type, subject, description, date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            id,
            data.leadId || null,
            data.customerId || null,
            data.type,
            data.subject,
            data.description || null,
            data.date,
            data.status || 'pending'
        );
        return { id, ...data };
    },

    // Support Ticket methods
    getTickets(): SupportTicket[] {
        return db.prepare(`
            SELECT t.*, c.name as customerName
            FROM Ticket t
            LEFT JOIN Customer c ON t.customerId = c.id
            ORDER BY t.createdAt DESC
        `).all() as SupportTicket[];
    },

    createTicket(data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'customerName'>): SupportTicket {
        const id = uuidv4();
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            INSERT INTO Ticket (id, customerId, subject, description, priority, status, assignedTo, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            id,
            data.customerId,
            data.subject,
            data.description,
            data.priority || 'medium',
            data.status || 'open',
            data.assignedTo || null,
            now,
            now
        );
        return { id, ...data, createdAt: now, updatedAt: now };
    }
};
