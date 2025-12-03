'use server';

import { orderService, CreateOrderData } from '@/lib/services/order-service';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(data: CreateOrderData) {
    try {
        const result = orderService.createOrder(data);
        revalidatePath('/dashboard/sales');
        revalidatePath('/dashboard/products'); // Stock changed
        revalidatePath('/dashboard'); // Stats changed
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to create order:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

export async function getOrdersAction() {
    try {
        const orders = orderService.getOrders();
        return { success: true, data: orders };
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return { success: false, error: 'Failed to fetch orders' };
    }
}
