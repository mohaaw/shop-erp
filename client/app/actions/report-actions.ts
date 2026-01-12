'use server';

import { reportService } from '@/lib/services/report-service';

export async function getSalesReportAction(startDate: string, endDate: string) {
    try {
        const data = reportService.getSalesReport(startDate, endDate);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to get sales report:', error);
        return { success: false, error: 'Failed to fetch sales report' };
    }
}

export async function getInventoryValuationAction() {
    try {
        const data = reportService.getInventoryValuation();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to get inventory valuation:', error);
        return { success: false, error: 'Failed to fetch inventory valuation' };
    }
}
