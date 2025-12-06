'use server';

import { manufacturingService, ProductionOrder, Workstation, JobCard } from '@/lib/services/manufacturing-service';
import { revalidatePath } from 'next/cache';

// BOM actions
export async function getBOMsAction() {
    return manufacturingService.getBOMs();
}

export async function getBOMByIdAction(id: string) {
    return manufacturingService.getBOMById(id);
}

export async function createBOMAction(data: {
    productId: string;
    quantity: number;
    name: string;
    items: { productId: string; quantity: number }[];
}) {
    // Create the BOM header
    const bom = manufacturingService.createBOM({
        productId: data.productId,
        quantity: data.quantity,
        isActive: true,
        notes: data.name, // Using notes for name/description for now
    });

    // Create BOM items
    for (const item of data.items) {
        manufacturingService.createBOMItem({
            bomId: bom.id,
            productId: item.productId,
            quantity: item.quantity,
            scrapRate: 0,
        });
    }

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

export async function getWorkstationsAction() {
    return manufacturingService.getWorkstations();
}

export async function createWorkstationAction(data: Omit<Workstation, 'id' | 'createdAt' | 'updatedAt'>) {
    manufacturingService.createWorkstation(data);
    revalidatePath('/dashboard/manufacturing/workstations');
}

export async function getJobCardsAction() {
    return manufacturingService.getJobCards();
}

export async function createJobCardAction(data: Omit<JobCard, 'id' | 'createdAt' | 'updatedAt' | 'productionOrderNumber' | 'workstationName'>) {
    manufacturingService.createJobCard(data);
    revalidatePath('/dashboard/manufacturing/job-cards');
}
