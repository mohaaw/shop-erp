'use server';

import { warehouseService, Warehouse, StockTransfer } from '@/lib/services/warehouse-service';
import { inventoryService } from '@/lib/services/inventory-service';
import { revalidatePath } from 'next/cache';

export async function getWarehousesAction() {
    return warehouseService.getWarehouses();
}

export async function createWarehouseAction(data: Omit<Warehouse, 'id'>) {
    warehouseService.createWarehouse(data);
    revalidatePath('/dashboard/inventory/warehouses');
}

export async function getStockTransfersAction() {
    return warehouseService.getStockTransfers();
}

export async function createStockTransferAction(data: Omit<StockTransfer, 'id'>) {
    warehouseService.createStockTransfer(data);
    revalidatePath('/dashboard/inventory/stock-transfers');
}

export async function createStockAdjustmentAction(data: { productId: string; locationId: string; newQuantity: number }) {
    // Using updateStock for adjustments
    inventoryService.updateStock(data.productId, data.locationId, data.newQuantity);
    revalidatePath('/dashboard/inventory/adjustments');
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
    inventoryService.updateStock(productId, locationId, quantity);
    revalidatePath('/dashboard/inventory/adjustments');
}

export async function getStockAdjustmentsAction() {
    return inventoryService.getStockAdjustments();
}

export async function getLocationsAction(warehouseId?: string) {
    return warehouseService.getLocations(warehouseId);
}
