import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface Employee {
    id: string;
    userId?: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    departmentId?: string;
    departmentName?: string;
    designation?: string;
    dateOfJoining?: string;
    dateOfBirth?: string;
    status: string;
    salary: number;
    createdAt: string;
    updatedAt: string;
}

export interface Department {
    id: string;
    name: string;
    code: string;
    parentId?: string;
    managerId?: string;
    createdAt: string;
}

export const employeeService = {
    getEmployees(): Employee[] {
        const stmt = db.prepare(`
            SELECT 
                e.*,
                d.name as departmentName
            FROM Employee e
            LEFT JOIN Department d ON e.departmentId = d.id
            ORDER BY e.createdAt DESC
        `);
        return stmt.all() as Employee[];
    },

    getEmployeeById(id: string): Employee | null {
        const stmt = db.prepare(`
            SELECT 
                e.*,
                d.name as departmentName
            FROM Employee e
            LEFT JOIN Department d ON e.departmentId = d.id
            WHERE e.id = ?
        `);
        return stmt.get(id) as Employee | null;
    },

    createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Employee (
                id, userId, employeeNumber, firstName, lastName, 
                email, phone, departmentId, designation, 
                dateOfJoining, dateOfBirth, status, salary, 
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.userId || null,
            data.employeeNumber,
            data.firstName,
            data.lastName,
            data.email || null,
            data.phone || null,
            data.departmentId || null,
            data.designation || null,
            data.dateOfJoining || null,
            data.dateOfBirth || null,
            data.status || 'active',
            data.salary || 0,
            now,
            now
        );

        return this.getEmployeeById(id)!;
    },

    updateEmployee(id: string, data: Partial<Employee>): Employee {
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            UPDATE Employee 
            SET firstName = ?, lastName = ?, email = ?, phone = ?,
                departmentId = ?, designation = ?, dateOfJoining = ?,
                dateOfBirth = ?, status = ?, salary = ?, updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(
            data.firstName,
            data.lastName,
            data.email || null,
            data.phone || null,
            data.departmentId || null,
            data.designation || null,
            data.dateOfJoining || null,
            data.dateOfBirth || null,
            data.status,
            data.salary,
            now,
            id
        );

        return this.getEmployeeById(id)!;
    },

    deleteEmployee(id: string): void {
        const stmt = db.prepare('DELETE FROM Employee WHERE id = ?');
        stmt.run(id);
    },

    // Department methods
    getDepartments(): Department[] {
        const stmt = db.prepare('SELECT * FROM Department ORDER BY name');
        return stmt.all() as Department[];
    },

    createDepartment(data: Omit<Department, 'id' | 'createdAt'>): Department {
        const id = uuidv4();
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO Department (id, name, code, parentId, managerId, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            data.name,
            data.code,
            data.parentId || null,
            data.managerId || null,
            now
        );

        return { ...data, id, createdAt: now };
    },
};
