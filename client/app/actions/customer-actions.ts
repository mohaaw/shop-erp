'use server';

import { CustomerService } from '@/lib/services/customer-service';
import { crmService, Activity, SupportTicket } from '@/lib/services/crm-service';
import { Customer } from '@/types/customer';
import { revalidatePath } from 'next/cache';

export async function getCustomersAction() {
    return CustomerService.getCustomers();
}

export async function createCustomerAction(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    CustomerService.createCustomer(data);
    revalidatePath('/dashboard/crm/customers');
}

export async function getActivitiesAction() {
    return crmService.getActivities();
}

export async function createActivityAction(data: Omit<Activity, 'id' | 'leadName' | 'customerName'>) {
    crmService.createActivity(data);
    revalidatePath('/dashboard/crm/activities');
}

export async function getTicketsAction() {
    return crmService.getTickets();
}

export async function createTicketAction(data: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'customerName'>) {
    crmService.createTicket(data);
    revalidatePath('/dashboard/crm/tickets');
}
