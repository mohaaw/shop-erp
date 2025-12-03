'use server';

import { serialBatchService, SerialNumber, Batch } from '@/lib/services/serial-batch-service';
import { revalidatePath } from 'next/cache';

export async function createSerialNumberAction(data: Omit<SerialNumber, 'id' | 'createdAt' | 'updatedAt' | 'productName' | 'locationName'>) {
    const serial = serialBatchService.createSerialNumber(data);
    revalidatePath('/dashboard/inventory/serials');
    return serial;
}

export async function getSerialNumbersAction(productId?: string) {
    return serialBatchService.getSerialNumbers(productId);
}

export async function updateSerialStatusAction(id: string, status: 'available' | 'sold' | 'scrapped', locationId?: string) {
    serialBatchService.updateSerialStatus(id, status, locationId);
    revalidatePath('/dashboard/inventory/serials');
}

export async function createBatchAction(data: Omit<Batch, 'id' | 'createdAt' | 'updatedAt' | 'productName' | 'locationName'>) {
    const batch = serialBatchService.createBatch(data);
    revalidatePath('/dashboard/inventory/batches');
    return batch;
}

export async function getBatchesAction(productId?: string) {
    return serialBatchService.getBatches(productId);
}

export async function getExpiringBatchesAction(daysAhead?: number) {
    return serialBatchService.getExpiringBatches(daysAhead);
}
