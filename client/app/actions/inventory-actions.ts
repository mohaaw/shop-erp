'use server';

import { inventoryService } from '@/lib/services/inventory-service';
import { revalidatePath } from 'next/cache';

export async function createWarehouseAction(name: string, code: string) {
    const result = inventoryService.createWarehouse({ name, code });
    revalidatePath('/dashboard/inventory');
    return result;
}

export async function getLowStockProductsAction() {
    try {
        const products = inventoryService.getLowStockProducts();
        return { success: true, data: products };
    } catch (error) {
        console.error('Failed to fetch low stock products:', error);
        return { success: false, error: 'Failed to fetch low stock products' };
    }
}

export async function updateStockAction(productId: string, locationId: string, quantity: number) {
    try {
        inventoryService.updateStock(productId, locationId, quantity);
        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard/inventory');
        return { success: true };
    } catch (error) {
        console.error('Failed to update stock:', error);
        return { success: false, error: 'Failed to update stock' };
    }
}

export async function getStockQuantsAction() {
    try {
        const quants = inventoryService.getAllStockQuants();
        return { success: true, data: quants };
    } catch (error) {
        console.error('Failed to fetch stock quants:', error);
        return { success: false, error: 'Failed to fetch stock quants' };
    }
}

export async function getLocationsAction() {
    try {
        const locations = inventoryService.getLocations();
        return { success: true, data: locations };
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        return { success: false, error: 'Failed to fetch locations' };
    }
}
