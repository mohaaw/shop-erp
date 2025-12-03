'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoiceDocument } from './invoice-document';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { OrderWithDetails } from '@/types/order';

interface InvoiceButtonProps {
    order: OrderWithDetails;
}

export function InvoiceButton({ order }: InvoiceButtonProps) {
    return (
        <PDFDownloadLink
            document={<InvoiceDocument order={order} />}
            fileName={`invoice-${order.id}.pdf`}
        >
            {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Generating PDF...' : 'Download Invoice'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
