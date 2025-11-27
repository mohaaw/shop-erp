# Phase 2: Implementation Guide - Advanced UI Components & CRUD

This guide explains how to implement Phase 2 features after the foundation is complete.

## 📋 Phase 2 Overview

Phase 2 focuses on:
1. Advanced UI components
2. Product Management CRUD
3. Data tables and forms
4. Real API integration

**Timeline**: 2-3 weeks
**Priority**: Core CRUD operations first, then advanced features

---

## 🎯 Phase 2 Tasks (In Order)

### Task 1: DataTable Component (Week 1)
**Files to create:**
- `components/ui/DataTable.tsx` - Main table component
- `components/ui/Pagination.tsx` - Pagination controls
- `hooks/useDataTable.ts` - Table logic hook

**Features:**
- Sorting by columns
- Filtering
- Pagination (10, 25, 50 per page)
- Row selection
- Actions column (edit, delete)

**Time estimate**: 2 days

### Task 2: Form Components (Week 1)
**Files to create:**
- `components/ui/Select.tsx` - Dropdown select
- `components/ui/Checkbox.tsx` - Checkbox input
- `components/ui/Radio.tsx` - Radio buttons
- `components/ui/Textarea.tsx` - Multi-line input

**Features:**
- Form integration with React Hook Form
- Validation support
- Accessible components
- Error display

**Time estimate**: 1.5 days

### Task 3: Dialog/Modal Component (Week 1)
**Files to create:**
- `components/ui/Dialog.tsx` - Modal dialog
- `components/ui/DialogTrigger.tsx` - Open button
- `components/ui/DialogContent.tsx` - Content wrapper
- `components/ui/DialogFooter.tsx` - Footer with actions

**Features:**
- Backdrop click to close
- Keyboard escape to close
- Smooth animations
- Focus management

**Time estimate**: 1 day

### Task 4: Product Management CRUD (Week 2-3)
**Files to create:**
- `app/dashboard/products/page.tsx` - Products list with DataTable
- `app/dashboard/products/[id]/page.tsx` - Product detail page
- `app/dashboard/products/create/page.tsx` - Create product form
- `app/dashboard/products/[id]/edit/page.tsx` - Edit product form
- `components/ProductTable.tsx` - Products DataTable wrapper
- `components/ProductForm.tsx` - Create/Edit form

**Features:**
- List all products with pagination
- Create new product
- Edit existing product
- Delete product with confirmation
- Form validation with Zod
- Image upload placeholder

**Time estimate**: 3-4 days

### Task 5: Inventory Module (Week 3)
**Files to create:**
- `app/dashboard/inventory/page.tsx` - Stock tracking
- `components/InventoryTable.tsx` - Stock levels table
- `components/StockAdjustmentForm.tsx` - Adjust stock form

**Features:**
- Real-time stock levels
- Low stock alerts (red when <10)
- Stock movement history
- Stock adjustment form

**Time estimate**: 2 days

---

## 💻 Code Examples for Phase 2

### DataTable Component Pattern

```typescript
// components/ui/DataTable.tsx
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  loading,
}: DataTableProps<T>) {
  const [sortBy, setSortBy] = React.useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const handleSort = (field: keyof T) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortBy, sortOrder]);

  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-secondary-200 dark:border-secondary-700 rounded-lg">
        <table className="w-full">
          <thead className="bg-secondary-50 dark:bg-secondary-800">
            <tr>
              {columns.map((col) => (
                <th key={String(col.accessor)} className="px-4 py-3 text-left">
                  <button
                    onClick={() => col.sortable && handleSort(col.accessor)}
                    className="font-semibold text-secondary-900 dark:text-white flex items-center gap-2"
                  >
                    {col.header}
                    {col.sortable && <span>⇅</span>}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-t border-secondary-200 dark:border-secondary-700">
                {columns.map((col) => (
                  <td key={String(col.accessor)} className="px-4 py-3">
                    {String(item[col.accessor])}
                  </td>
                ))}
                <td className="px-4 py-3 space-x-2">
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="danger" onClick={() => onDelete(item)}>
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Page {page} of {Math.ceil(sortedData.length / pageSize)}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(sortedData.length / pageSize)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Product CRUD Page Example

```typescript
// app/dashboard/products/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/products';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
  const { products, deleteProduct } = useProductStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const columns = [
    { header: 'Name', accessor: 'name' as const, sortable: true },
    { header: 'SKU', accessor: 'sku' as const, sortable: true },
    { header: 'Price', accessor: 'price' as const, sortable: true },
    { header: 'Stock', accessor: 'stock' as const, sortable: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/dashboard/products/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Product
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={products}
        onEdit={(product) => {
          // Navigate to edit page
        }}
        onDelete={(product) => {
          if (deleteConfirm === product.id) {
            deleteProduct(product.id);
            setDeleteConfirm(null);
          } else {
            setDeleteConfirm(product.id);
          }
        }}
      />
    </div>
  );
}
```

---

## 📂 Phase 2 File Structure

After Phase 2, your structure will be:

```
client/
├── components/
│   ├── ui/
│   │   ├── DataTable.tsx          # NEW
│   │   ├── Pagination.tsx         # NEW
│   │   ├── Select.tsx             # NEW
│   │   ├── Checkbox.tsx           # NEW
│   │   ├── Radio.tsx              # NEW
│   │   ├── Textarea.tsx           # NEW
│   │   ├── Dialog.tsx             # NEW
│   │   └── [existing components]
│   ├── ProductTable.tsx           # NEW
│   ├── ProductForm.tsx            # NEW
│   ├── InventoryTable.tsx         # NEW
│   └── [existing]
│
├── app/
│   ├── dashboard/
│   │   ├── products/
│   │   │   ├── page.tsx           # NEW - List
│   │   │   ├── create/
│   │   │   │   └── page.tsx       # NEW - Create form
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # NEW - Detail
│   │   │       └── edit/
│   │   │           └── page.tsx   # NEW - Edit form
│   │   └── [existing]
│   └── [existing]
│
├── hooks/
│   ├── useDataTable.ts            # NEW
│   └── [future hooks]
│
└── [existing]
```

---

## 🔄 Development Workflow for Phase 2

### Step 1: Branch for Phase 2
```bash
git checkout -b feature/phase2-components
```

### Step 2: Build One Component at a Time
```bash
# Build DataTable component
# Test it with mock data
# Commit

git add .
git commit -m "feat: Add DataTable component with sorting and pagination"
```

### Step 3: Create Product Pages
```bash
# Create product list page using DataTable
# Create forms for create/edit
# Connect to Zustand store
# Commit

git add .
git commit -m "feat: Add product management CRUD pages"
```

### Step 4: Testing Locally
```bash
npm run dev
# Test all CRUD operations
# Test responsive design
# Test dark/light themes
```

### Step 5: Push and Create PR
```bash
git push origin feature/phase2-components
# Create Pull Request on GitHub
# Review changes
# Merge to main
```

---

## ✅ Phase 2 Completion Checklist

- [ ] DataTable component with sorting/pagination
- [ ] Form components (Select, Checkbox, Radio, Textarea)
- [ ] Dialog/Modal component
- [ ] Product list page with DataTable
- [ ] Product create form page
- [ ] Product edit form page
- [ ] Product delete with confirmation
- [ ] Inventory tracking page
- [ ] Stock adjustment form
- [ ] All CRUD operations tested
- [ ] Dark/light theme tested
- [ ] Mobile responsive verified
- [ ] Documentation updated
- [ ] Code committed to GitHub
- [ ] Pull request merged to main

---

## 🚀 After Phase 2

**Phase 3 will include:**
- Sales & Orders module
- Customer CRM
- Advanced reporting
- Payment integration
- Admin settings

---

## 📞 Tips for Phase 2 Implementation

1. **Start Small**: Build one component at a time
2. **Test Thoroughly**: Test each component before moving to next
3. **Use Mock Data**: Use Zustand stores for testing
4. **Commit Often**: Small, focused commits
5. **Document As You Go**: Update README with new features
6. **Follow Patterns**: Match existing code style
7. **Mobile First**: Test on mobile devices

---

**Ready to start Phase 2! Push to GitHub and begin development! 🚀**
