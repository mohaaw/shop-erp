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

export async function getOrderAction(id: string) {
    try {
        const order = orderService.getOrderById(id);
        return { success: true, order };
    } catch (error) {
        console.error('Failed to get order:', error);
        return { success: false, error: 'Failed to get order' };
    }
}

export async function updateOrderStatusAction(id: string, status: string) {
    try {
        orderService.updateOrderStatus(id, status);
        revalidatePath('/dashboard/sales');
        return { success: true };
    } catch (error) {
        console.error('Failed to update order status:', error);
        return { success: false, error: 'Failed to update order status' };
    }
}

export async function updatePaymentStatusAction(id: string, status: string) {
    try {
        orderService.updatePaymentStatus(id, status);
        revalidatePath('/dashboard/sales');
        return { success: true };
    } catch (error) {
        console.error('Failed to update payment status:', error);
        return { success: false, error: 'Failed to update payment status' };
    }
}
