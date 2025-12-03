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
};
