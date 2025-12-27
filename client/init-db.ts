import { db } from './lib/db';

const schema = `
CREATE TABLE IF NOT EXISTS "Translation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locale" TEXT NOT NULL,
    "namespace" TEXT NOT NULL DEFAULT 'common',
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Translation_locale_namespace_key_key" ON "Translation"("locale", "namespace", "key");

CREATE TABLE IF NOT EXISTS "Warehouse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Warehouse_code_key" ON "Warehouse"("code");

CREATE TABLE IF NOT EXISTS "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "warehouseId" TEXT,
    "parentId" TEXT,
    FOREIGN KEY ("warehouseId") REFERENCES "Warehouse" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("parentId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Location_code_key" ON "Location"("code");

CREATE TABLE IF NOT EXISTS "StockMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "sourceLocationId" TEXT NOT NULL,
    "destLocationId" TEXT NOT NULL,
    "reference" TEXT,
    "state" TEXT NOT NULL DEFAULT 'draft',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sourceLocationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("destLocationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "StockQuant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "StockQuant_productId_locationId_key" ON "StockQuant"("productId", "locationId");

CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "cost" REAL NOT NULL DEFAULT 0,
    "sku" TEXT,
    "barcode" TEXT,
    "categoryId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'storable',
    "image" TEXT,
    "availableInPos" BOOLEAN NOT NULL DEFAULT 1,
    "posCategory" TEXT,
    "toppings" TEXT,
    "isCombo" BOOLEAN NOT NULL DEFAULT 0,
    "comboItems" TEXT,
    "weight" REAL,
    "volume" REAL,
    "hsCode" TEXT,
    "countryOfOrigin" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "specifications" TEXT,
    "warranty" TEXT,
    "minStock" REAL DEFAULT 0,
    "valuationMethod" TEXT DEFAULT 'FIFO',
    "standardPrice" REAL DEFAULT 0,
    "shelfLife" REAL,
    "weightUom" TEXT,
    "volumeUom" TEXT,
    "dimensions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "twoFactorEnabled" BOOLEAN DEFAULT 0,
    "twoFactorSecret" TEXT,
    "backupCodes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT,
    "total" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    "balance" REAL NOT NULL DEFAULT 0,
    "isGroup" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("parentId") REFERENCES "Account" ("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "JournalItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "journalEntryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" REAL NOT NULL DEFAULT 0,
    "credit" REAL NOT NULL DEFAULT 0,
    FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT UNIQUE NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "date" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" TEXT NOT NULL, -- draft, posted, paid, cancelled
    "totalAmount" REAL DEFAULT 0,
    "taxAmount" REAL DEFAULT 0,
    "journalEntryId" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id"),
    FOREIGN KEY ("orderId") REFERENCES "Order"("id"),
    FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id")
);

CREATE TABLE IF NOT EXISTS "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "taxId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PurchaseInvoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT UNIQUE NOT NULL,
    "supplierId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" TEXT NOT NULL, -- draft, posted, paid, cancelled
    "totalAmount" REAL DEFAULT 0,
    "taxAmount" REAL DEFAULT 0,
    "journalEntryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id"),
    FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id")
);

CREATE TABLE IF NOT EXISTS "PurchaseInvoiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT,
    "accountId" TEXT NOT NULL,
    "quantity" REAL DEFAULT 1,
    "unitPrice" REAL DEFAULT 0,
    "amount" REAL DEFAULT 0,
    FOREIGN KEY ("invoiceId") REFERENCES "PurchaseInvoice"("id"),
    FOREIGN KEY ("accountId") REFERENCES "Account"("id")
);

CREATE TABLE IF NOT EXISTS "InvoiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" REAL DEFAULT 1,
    "unitPrice" REAL DEFAULT 0,
    "taxRate" REAL DEFAULT 0,
    "amount" REAL DEFAULT 0,
    FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id"),
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "price" REAL NOT NULL,
    FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT
);
`;

try {
    db.exec(schema);

    const createRFQTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS RFQ (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL UNIQUE,
            supplierId TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, quoted, closed
            notes TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (supplierId) REFERENCES Supplier(id)
        )
    `);
    createRFQTable.run();

    const createRFQItemTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS RFQItem (
            id TEXT PRIMARY KEY,
            rfqId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity REAL DEFAULT 1,
            quotedPrice REAL DEFAULT 0,
            notes TEXT,
            FOREIGN KEY (rfqId) REFERENCES RFQ(id),
            FOREIGN KEY (productId) REFERENCES Product(id)
        )
    `);
    createRFQItemTable.run();

    const createPurchaseOrderTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS PurchaseOrder (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL UNIQUE,
            supplierId TEXT NOT NULL,
            rfqId TEXT,
            date TEXT NOT NULL,
            expectedDate TEXT,
            status TEXT NOT NULL DEFAULT 'draft', -- draft, confirmed, received, cancelled
            totalAmount REAL DEFAULT 0,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (supplierId) REFERENCES Supplier(id),
            FOREIGN KEY (rfqId) REFERENCES RFQ(id)
        )
    `);
    createPurchaseOrderTable.run();

    const createPurchaseOrderItemTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS PurchaseOrderItem (
            id TEXT PRIMARY KEY,
            orderId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity REAL DEFAULT 1,
            unitPrice REAL DEFAULT 0,
            receivedQty REAL DEFAULT 0,
            FOREIGN KEY (orderId) REFERENCES PurchaseOrder(id),
            FOREIGN KEY (productId) REFERENCES Product(id)
        )
    `);
    createPurchaseOrderItemTable.run();

    const createPurchaseReceiptTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS PurchaseReceipt (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL UNIQUE,
            purchaseOrderId TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'draft', -- draft, completed
            notes TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (purchaseOrderId) REFERENCES PurchaseOrder(id)
        )
    `);
    createPurchaseReceiptTable.run();

    const createPurchaseReceiptItemTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS PurchaseReceiptItem (
            id TEXT PRIMARY KEY,
            receiptId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity REAL DEFAULT 1,
            locationId TEXT,
            batchNumber TEXT,
            FOREIGN KEY (receiptId) REFERENCES PurchaseReceipt(id),
            FOREIGN KEY (productId) REFERENCES Product(id),
            FOREIGN KEY (locationId) REFERENCES Location(id)
        )
    `);
    createPurchaseReceiptItemTable.run();

    createPurchaseReceiptItemTable.run();

    const createLeadTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Lead (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            company TEXT,
            source TEXT, -- website, referral, campaign, etc.
            status TEXT NOT NULL DEFAULT 'new', -- new, contacted, qualified, converted, lost
            score INTEGER DEFAULT 0,
            assignedTo TEXT,
            notes TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (assignedTo) REFERENCES User(id)
        )
    `);
    createLeadTable.run();

    const createOpportunityTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Opportunity (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            customerId TEXT,
            leadId TEXT,
            stage TEXT NOT NULL DEFAULT 'qualification', -- qualification, proposal, negotiation, closed_won, closed_lost
            expectedRevenue REAL DEFAULT 0,
            probability INTEGER DEFAULT 0,
            expectedCloseDate TEXT,
            assignedTo TEXT,
            notes TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (customerId) REFERENCES Customer(id),
            FOREIGN KEY (leadId) REFERENCES Lead(id),
            FOREIGN KEY (assignedTo) REFERENCES User(id)
        )
    `);
    createOpportunityTable.run();

    const createActivityTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Activity (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL, -- call, meeting, email, task
            subject TEXT NOT NULL,
            description TEXT,
            relatedTo TEXT, -- lead, opportunity, customer
            relatedId TEXT,
            assignedTo TEXT,
            dueDate TEXT,
            status TEXT DEFAULT 'pending', -- pending, completed, cancelled
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (assignedTo) REFERENCES User(id)
        )
    `);
    createActivityTable.run();

    const createTicketTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Ticket (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL UNIQUE,
            customerId TEXT NOT NULL,
            subject TEXT NOT NULL,
            description TEXT,
            priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
            status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
            assignedTo TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (customerId) REFERENCES Customer(id),
            FOREIGN KEY (assignedTo) REFERENCES User(id)
        )
    `);
    createTicketTable.run();

    const createNoteTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Note (
            id TEXT PRIMARY KEY,
            relatedTo TEXT NOT NULL, -- customer, lead, opportunity, ticket
            relatedId TEXT NOT NULL,
            content TEXT NOT NULL,
            createdBy TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (createdBy) REFERENCES User(id)
        )
    `);
    createNoteTable.run();

    createNoteTable.run();

    const createDepartmentTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Department (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT NOT NULL UNIQUE,
            parentId TEXT,
            managerId TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (parentId) REFERENCES Department(id),
            FOREIGN KEY (managerId) REFERENCES User(id)
        )
    `);
    createDepartmentTable.run();

    const createEmployeeTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Employee (
            id TEXT PRIMARY KEY,
            userId TEXT UNIQUE,
            employeeNumber TEXT NOT NULL UNIQUE,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            departmentId TEXT,
            designation TEXT,
            dateOfJoining TEXT,
            dateOfBirth TEXT,
            status TEXT DEFAULT 'active', -- active, on_leave, terminated
            salary REAL DEFAULT 0,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(id),
            FOREIGN KEY (departmentId) REFERENCES Department(id)
        )
    `);
    createEmployeeTable.run();

    const createAttendanceTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Attendance (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            date TEXT NOT NULL,
            checkIn TEXT,
            checkOut TEXT,
            status TEXT DEFAULT 'present', -- present, absent, half_day, on_leave
            notes TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (employeeId) REFERENCES Employee(id)
        )
    `);
    createAttendanceTable.run();

    const createLeaveApplicationTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS LeaveApplication (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            leaveType TEXT NOT NULL, -- sick, casual, annual, unpaid
            fromDate TEXT NOT NULL,
            toDate TEXT NOT NULL,
            days REAL NOT NULL,
            reason TEXT,
            status TEXT DEFAULT 'pending', -- pending, approved, rejected
            approvedBy TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (employeeId) REFERENCES Employee(id),
            FOREIGN KEY (approvedBy) REFERENCES User(id)
        )
    `);
    createLeaveApplicationTable.run();

    const createPayrollTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Payroll (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            month TEXT NOT NULL,
            year INTEGER NOT NULL,
            basicSalary REAL DEFAULT 0,
            allowances REAL DEFAULT 0,
            deductions REAL DEFAULT 0,
            netSalary REAL DEFAULT 0,
            status TEXT DEFAULT 'draft', -- draft, processed, paid
            paidDate TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (employeeId) REFERENCES Employee(id)
        )
    `);
    createPayrollTable.run();

    const createExpenseClaimTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS ExpenseClaim (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL, -- travel, meals, accommodation, etc.
            amount REAL NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending', -- pending, approved, rejected, paid
            approvedBy TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (employeeId) REFERENCES Employee(id),
            FOREIGN KEY (approvedBy) REFERENCES User(id)
        )
    `);
    createExpenseClaimTable.run();

    createExpenseClaimTable.run();

    const createBOMTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS BOM (
            id TEXT PRIMARY KEY,
            productId TEXT NOT NULL,
            quantity REAL DEFAULT 1,
            isActive BOOLEAN DEFAULT 1,
            notes TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (productId) REFERENCES Product(id)
        )
    `);
    createBOMTable.run();

    const createBOMItemTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS BOMItem (
            id TEXT PRIMARY KEY,
            bomId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity REAL NOT NULL,
            scrapRate REAL DEFAULT 0,
            FOREIGN KEY (bomId) REFERENCES BOM(id),
            FOREIGN KEY (productId) REFERENCES Product(id)
        )
    `);
    createBOMItemTable.run();

    const createWorkStationTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS WorkStation (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT NOT NULL UNIQUE,
            capacity REAL DEFAULT 1,
            costPerHour REAL DEFAULT 0,
            status TEXT DEFAULT 'active', -- active, maintenance, inactive
            createdAt TEXT NOT NULL
        )
    `);
    createWorkStationTable.run();

    const createProductionOrderTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS ProductionOrder (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL UNIQUE,
            productId TEXT NOT NULL,
            bomId TEXT,
            quantity REAL NOT NULL,
            plannedStartDate TEXT,
            plannedEndDate TEXT,
            actualStartDate TEXT,
            actualEndDate TEXT,
            status TEXT DEFAULT 'draft', -- draft, in_progress, completed, cancelled
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (productId) REFERENCES Product(id),
            FOREIGN KEY (bomId) REFERENCES BOM(id)
        )
    `);
    createProductionOrderTable.run();

    const createJobCardTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS JobCard (
            id TEXT PRIMARY KEY,
            productionOrderId TEXT NOT NULL,
            workStationId TEXT NOT NULL,
            employeeId TEXT,
            operation TEXT NOT NULL,
            plannedDuration REAL DEFAULT 0,
            actualDuration REAL DEFAULT 0,
            startTime TEXT,
            endTime TEXT,
            status TEXT DEFAULT 'pending', -- pending, in_progress, completed
            createdAt TEXT NOT NULL,
            FOREIGN KEY (productionOrderId) REFERENCES ProductionOrder(id),
            FOREIGN KEY (workStationId) REFERENCES WorkStation(id),
            FOREIGN KEY (employeeId) REFERENCES Employee(id)
        )
    `);
    createJobCardTable.run();

    const createMaterialRequestTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS MaterialRequest (
            id TEXT PRIMARY KEY,
            number TEXT NOT NULL UNIQUE,
            productionOrderId TEXT,
            requestedBy TEXT,
            requestDate TEXT NOT NULL,
            requiredDate TEXT,
            status TEXT DEFAULT 'pending', -- pending, approved, issued, cancelled
            createdAt TEXT NOT NULL,
            FOREIGN KEY (productionOrderId) REFERENCES ProductionOrder(id),
            FOREIGN KEY (requestedBy) REFERENCES User(id)
        )
    `);
    createMaterialRequestTable.run();

    const createMaterialRequestItemTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS MaterialRequestItem (
            id TEXT PRIMARY KEY,
            requestId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity REAL NOT NULL,
            issuedQty REAL DEFAULT 0,
            FOREIGN KEY (requestId) REFERENCES MaterialRequest(id),
            FOREIGN KEY (productId) REFERENCES Product(id)
        )
    `);
    createMaterialRequestItemTable.run();

    createMaterialRequestItemTable.run();

    // PPM Tables
    const createProjectTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Project (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT NOT NULL UNIQUE,
            customerId TEXT,
            status TEXT DEFAULT 'planning', -- planning, in_progress, on_hold, completed, cancelled
            startDate TEXT,
            endDate TEXT,
            budget REAL DEFAULT 0,
            actualCost REAL DEFAULT 0,
            projectManager TEXT,
            description TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (customerId) REFERENCES Customer(id),
            FOREIGN KEY (projectManager) REFERENCES User(id)
        )
    `);
    createProjectTable.run();

    const createTaskTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Task (
            id TEXT PRIMARY KEY,
            projectId TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            assignedTo TEXT,
            status TEXT DEFAULT 'todo', -- todo, in_progress, review, done
            priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
            startDate TEXT,
            dueDate TEXT,
            estimatedHours REAL DEFAULT 0,
            actualHours REAL DEFAULT 0,
            parentTaskId TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (projectId) REFERENCES Project(id),
            FOREIGN KEY (assignedTo) REFERENCES User(id),
            FOREIGN KEY (parentTaskId) REFERENCES Task(id)
        )
    `);
    createTaskTable.run();

    const createTimesheetTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Timesheet (
            id TEXT PRIMARY KEY,
            employeeId TEXT NOT NULL,
            projectId TEXT,
            taskId TEXT,
            date TEXT NOT NULL,
            hours REAL NOT NULL,
            description TEXT,
            billable BOOLEAN DEFAULT 1,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (employeeId) REFERENCES Employee(id),
            FOREIGN KEY (projectId) REFERENCES Project(id),
            FOREIGN KEY (taskId) REFERENCES Task(id)
        )
    `);
    createTimesheetTable.run();

    // Digital Commerce Tables
    const createCartTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS Cart (
            id TEXT PRIMARY KEY,
            customerId TEXT,
            sessionId TEXT,
            status TEXT DEFAULT 'active', -- active, abandoned, converted
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (customerId) REFERENCES Customer(id)
        )
    `);
    createCartTable.run();

    const createCartItemTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS CartItem (
            id TEXT PRIMARY KEY,
            cartId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity REAL NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (cartId) REFERENCES Cart(id),
            FOREIGN KEY (productId) REFERENCES Product(id)
        )
    `);
    createCartItemTable.run();

    const createWebPageTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS WebPage (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            content TEXT,
            type TEXT DEFAULT 'page', -- page, blog, product_category
            published BOOLEAN DEFAULT 0,
            publishedAt TEXT,
            createdBy TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            FOREIGN KEY (createdBy) REFERENCES User(id)
        )
    `);
    createWebPageTable.run();

    const createWebFormTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS WebForm (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            fields TEXT NOT NULL, -- JSON array of field definitions
            submitAction TEXT, -- email, create_lead, create_ticket, etc.
            isActive BOOLEAN DEFAULT 1,
            createdAt TEXT NOT NULL
        )
    `);
    createWebFormTable.run();

    const createWebFormSubmissionTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS WebFormSubmission (
            id TEXT PRIMARY KEY,
            formId TEXT NOT NULL,
            data TEXT NOT NULL, -- JSON data
            ipAddress TEXT,
            submittedAt TEXT NOT NULL,
            FOREIGN KEY (formId) REFERENCES WebForm(id)
        )
    `);
    createWebFormSubmissionTable.run();

    createWebFormSubmissionTable.run();

    const createAuditLogTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS AuditLog (
            id TEXT PRIMARY KEY,
            userId TEXT,
            action TEXT NOT NULL,
            entity TEXT NOT NULL,
            entityId TEXT,
            changes TEXT,
            ipAddress TEXT,
            userAgent TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES User(id)
        )
    `);
    createAuditLogTable.run();

    console.log('Database initialized successfully.');

    // Create indexes for performance
    console.log('Creating database indexes...');
    import('./lib/create-indexes').then(({ createIndexes }) => {
        createIndexes();
    });
} catch (error) {
    console.error('Failed to initialize database:', error);
}
