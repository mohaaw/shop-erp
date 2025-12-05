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

export interface Attendance {
    id: string;
    employeeId: string;
    date: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
    employeeName?: string;
}

export interface LeaveApplication {
    id: string;
    employeeId: string;
    type: string;
    startDate: string;
    endDate: string;
    reason?: string;
    status: string;
    employeeName?: string;
}

export interface Payroll {
    id: string;
    employeeId: string;
    month: number;
    year: number;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: string;
    employeeName?: string;
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

    // Attendance methods
    getAttendance(): Attendance[] {
        return db.prepare(`
            SELECT a.*, e.firstName || ' ' || e.lastName as employeeName
            FROM Attendance a
            LEFT JOIN Employee e ON a.employeeId = e.id
            ORDER BY a.date DESC
        `).all() as Attendance[];
    },

    createAttendance(data: Omit<Attendance, 'id' | 'employeeName'>): Attendance {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO Attendance (id, employeeId, date, status, checkIn, checkOut)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, data.employeeId, data.date, data.status, data.checkIn || null, data.checkOut || null);
        return { id, ...data };
    },

    // Leave methods
    getLeaves(): LeaveApplication[] {
        return db.prepare(`
            SELECT l.*, e.firstName || ' ' || e.lastName as employeeName
            FROM LeaveApplication l
            LEFT JOIN Employee e ON l.employeeId = e.id
            ORDER BY l.startDate DESC
        `).all() as LeaveApplication[];
    },

    createLeave(data: Omit<LeaveApplication, 'id' | 'employeeName'>): LeaveApplication {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO LeaveApplication (id, employeeId, type, startDate, endDate, reason, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, data.employeeId, data.type, data.startDate, data.endDate, data.reason || null, data.status || 'pending');
        return { id, ...data };
    },

    // Payroll methods
    getPayroll(): Payroll[] {
        return db.prepare(`
            SELECT p.*, e.firstName || ' ' || e.lastName as employeeName
            FROM Payroll p
            LEFT JOIN Employee e ON p.employeeId = e.id
            ORDER BY p.month DESC
        `).all() as Payroll[];
    },

    createPayroll(data: Omit<Payroll, 'id' | 'employeeName'>): Payroll {
        const id = uuidv4();
        const stmt = db.prepare(`
            INSERT INTO Payroll (id, employeeId, month, year, basicSalary, allowances, deductions, netSalary, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            id,
            data.employeeId,
            data.month,
            data.year,
            data.basicSalary,
            data.allowances || 0,
            data.deductions || 0,
            data.netSalary,
            data.status || 'draft'
        );
        return { id, ...data };
    }
};
