'use server';

import { manufacturingService, BOM, ProductionOrder } from '@/lib/services/manufacturing-service';
import { revalidatePath } from 'next/cache';

// BOM actions
export async function getBOMsAction() {
    return manufacturingService.getBOMs();
}

export async function getBOMByIdAction(id: string) {
    return manufacturingService.getBOMById(id);
}

export async function createBOMAction(data: Omit<BOM, 'id' | 'createdAt' | 'updatedAt'>) {
    const bom = manufacturingService.createBOM(data);
    revalidatePath('/dashboard/manufacturing/bom');
    return bom;
}

// Production Order actions
export async function getProductionOrdersAction() {
    return manufacturingService.getProductionOrders();
}

export async function getProductionOrderByIdAction(id: string) {
    return manufacturingService.getProductionOrderById(id);
}

export async function createProductionOrderAction(data: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) {
    const order = manufacturingService.createProductionOrder(data);
    revalidatePath('/dashboard/manufacturing/production-orders');
    return order;
}

export async function updateProductionOrderAction(id: string, data: Partial<ProductionOrder>) {
    const order = manufacturingService.updateProductionOrder(id, data);
    revalidatePath('/dashboard/manufacturing/production-orders');
    return order;
}
