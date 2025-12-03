'use server';

import { crmService, Lead, Opportunity } from '@/lib/services/crm-service';
import { revalidatePath } from 'next/cache';

// Lead actions
export async function getLeadsAction() {
    return crmService.getLeads();
}

export async function getLeadByIdAction(id: string) {
    return crmService.getLeadById(id);
}

export async function createLeadAction(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
    const lead = crmService.createLead(data);
    revalidatePath('/dashboard/crm/leads');
    return lead;
}

export async function updateLeadAction(id: string, data: Partial<Lead>) {
    const lead = crmService.updateLead(id, data);
    revalidatePath('/dashboard/crm/leads');
    return lead;
}

export async function deleteLeadAction(id: string) {
    crmService.deleteLead(id);
    revalidatePath('/dashboard/crm/leads');
}

// Opportunity actions
export async function getOpportunitiesAction() {
    return crmService.getOpportunities();
}

export async function getOpportunityByIdAction(id: string) {
    return crmService.getOpportunityById(id);
}

export async function createOpportunityAction(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) {
    const opportunity = crmService.createOpportunity(data);
    revalidatePath('/dashboard/crm/opportunities');
    return opportunity;
}

export async function updateOpportunityAction(id: string, data: Partial<Opportunity>) {
    const opportunity = crmService.updateOpportunity(id, data);
    revalidatePath('/dashboard/crm/opportunities');
    return opportunity;
}

export async function deleteOpportunityAction(id: string) {
    crmService.deleteOpportunity(id);
    revalidatePath('/dashboard/crm/opportunities');
}
