'use server';

import { warehouseService, Warehouse, Location, StockTransfer } from '@/lib/services/warehouse-service';
import { revalidatePath } from 'next/cache';

export async function getWarehousesAction() {
    return warehouseService.getWarehouses();
}

export async function createWarehouseAction(data: Omit<Warehouse, 'id'>) {
    const warehouse = warehouseService.createWarehouse(data);
    revalidatePath('/dashboard/inventory/warehouses');
    return warehouse;
}

export async function getLocationsAction(warehouseId?: string) {
    return warehouseService.getLocations(warehouseId);
}

export async function createLocationAction(data: Omit<Location, 'id' | 'children'>) {
    const location = warehouseService.createLocation(data);
    revalidatePath('/dashboard/inventory/locations');
    revalidatePath('/dashboard/inventory/warehouses');
    return location;
}

export async function getStockByLocationAction(productId?: string) {
    return warehouseService.getStockByLocation(productId);
}

export async function createStockTransferAction(data: Omit<StockTransfer, 'id'>) {
    const transfer = warehouseService.createStockTransfer(data);
    revalidatePath('/dashboard/inventory/transfers');
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/inventory/warehouses');
    return transfer;
}

export async function getStockTransfersAction() {
    return warehouseService.getStockTransfers();
}
