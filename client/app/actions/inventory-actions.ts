'use server';

import { inventoryService } from '@/lib/services/inventory-service';
import { revalidatePath } from 'next/cache';

export async function createWarehouseAction(name: string, code: string) {
    const result = inventoryService.createWarehouse({ name, code });
    revalidatePath('/dashboard/inventory');
    return result;
}

export async function getLowStockProductsAction() {
    // In a real app, we would query the database directly for low stock items.
    // For now, we'll fetch all products and filter them in JS as a temporary solution
    // until we add a specific method to ProductService/InventoryService.
    const products = inventoryService.getProductsWithStock();
    return products.filter((p: any) => {
        const minStock = p.minStock || 0;
        return minStock > 0 && (p.stock || 0) < minStock;
    });
}
