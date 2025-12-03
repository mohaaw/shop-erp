'use server';

import { CustomerService } from '@/lib/services/customer-service';

export async function getCustomersAction() {
    try {
        const customers = CustomerService.getCustomers();
        return { success: true, customers };
    } catch (error) {
        console.error('Failed to get customers:', error);
        return { success: false, error: 'Failed to get customers' };
    }
}
