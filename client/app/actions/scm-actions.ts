'use server';

import { supplierService, Supplier } from '@/lib/services/supplier-service';
import { purchaseOrderService, PurchaseOrder } from '@/lib/services/purchase-order-service';
import { revalidatePath } from 'next/cache';

// Suppliers
export async function getSuppliersAction() {
    return supplierService.getSuppliers();
}

export async function createSupplierAction(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) {
    supplierService.createSupplier(data);
    revalidatePath('/dashboard/scm/suppliers');
}

// Purchase Orders
export async function getPurchaseOrdersAction() {
    return purchaseOrderService.getPurchaseOrders();
}

export async function createPurchaseOrderAction(data: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt' | 'supplierName'>) {
    purchaseOrderService.createPurchaseOrder(data);
    revalidatePath('/dashboard/scm/purchase-orders');
}
