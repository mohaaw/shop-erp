import "server-only";
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
    id: string;
    name: string;
    code: string;
    description?: string;
    customerId?: string;
    status: string;
    budget: number;
    actualCost: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    projectId: string;
    projectName?: string;
    title: string;
    description?: string;
    assignedTo?: string;
    status: string;
    priority: string;
    dueDate?: string;
    createdAt: string;
}

export interface Timesheet {
    id: string;
    projectId: string;
    taskId?: string;
    employeeId: string;
    date: string;
    hours: number;
    description?: string;
    projectName?: string;
    taskTitle?: string;
}

export const projectService = {
    // Project methods
    getProjects(): Project[] {
        const stmt = db.prepare('SELECT * FROM Project ORDER BY createdAt DESC');
        return stmt.all() as Project[];
    },

    getProjectById(id: string): Project | null {
        const stmt = db.prepare('SELECT * FROM Project WHERE id = ?');
        return stmt.get(id) as Project | null;
    },

    createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Project (
                id, name, code, description, customerId, status,
                budget, actualCost, startDate, endDate, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.name,
            data.code,
            data.description || null,
            data.customerId || null,
            data.status || 'planning',
            data.budget || 0,
            data.actualCost || 0,
            data.startDate || null,
            data.endDate || null,
            now,
            now
        );

        return this.getProjectById(id)!;
    },

    // Task methods
    getTasks(): Task[] {
        const stmt = db.prepare(`
            SELECT t.*, p.name as projectName
            FROM Task t
            LEFT JOIN Project p ON t.projectId = p.id
            ORDER BY t.createdAt DESC
        `);
        return stmt.all() as Task[];
    },

    getTaskById(id: string): Task | null {
        const stmt = db.prepare(`
            SELECT t.*, p.name as projectName
            FROM Task t
            LEFT JOIN Project p ON t.projectId = p.id
            WHERE t.id = ?
        `);
        return stmt.get(id) as Task | null;
    },

    createTask(data: Omit<Task, 'id' | 'createdAt'>): Task {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Task (
                id, projectId, title, description, assignedTo,
                status, priority, dueDate, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.projectId,
            data.title,
            data.description || null,
            data.assignedTo || null,
            data.status || 'todo',
            data.priority || 'medium',
            data.dueDate || null,
            now
        );

        return this.getTaskById(id)!;
    },

    updateTask(id: string, data: Partial<Task>): Task {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            UPDATE Task
            SET title = ?, description = ?, assignedTo = ?,
                status = ?, priority = ?, dueDate = ?, updatedAt = ?
            WHERE id = ?
        `);

        // Need to get existing task to merge data or handle partial updates more dynamically.
        // For simplicity in this robust environment, let's assume we pass all needed fields or acceptable defaults,
        // but better-sqlite3 with standard SQL requires all params if we bind them.
        // Actually, let's just fetch, merge, and update.
        const current = this.getTaskById(id);
        if (!current) throw new Error('Task not found');

        const updated = { ...current, ...data };

        stmt.run(
            updated.title,
            updated.description || null,
            updated.assignedTo || null,
            updated.status,
            updated.priority,
            updated.dueDate || null,
            now,
            id
        );

        return this.getTaskById(id)!;
    },

    // Timesheet methods
    getTimesheets(): Timesheet[] {
        return db.prepare(`
            SELECT t.*, p.name as projectName, task.title as taskTitle
            FROM Timesheet t
            LEFT JOIN Project p ON t.projectId = p.id
            LEFT JOIN Task task ON t.taskId = task.id
            ORDER BY t.date DESC
        `).all() as Timesheet[];
    },

    createTimesheet(data: Omit<Timesheet, 'id' | 'projectName' | 'taskTitle'>): Timesheet {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO Timesheet (id, projectId, taskId, employeeId, date, hours, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            id,
            data.projectId,
            data.taskId || null,
            data.employeeId,
            data.date,
            data.hours,
            data.description || null
        );
        return { id, ...data };
    }
};
