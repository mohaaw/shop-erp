'use server';

import { supplierService, Supplier } from '@/lib/services/supplier-service';
import { revalidatePath } from 'next/cache';

export async function getSuppliersAction() {
    return supplierService.getSuppliers();
}

export async function createSupplierAction(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) {
    const supplier = supplierService.createSupplier(data);
    revalidatePath('/dashboard/suppliers');
    return supplier;
}
