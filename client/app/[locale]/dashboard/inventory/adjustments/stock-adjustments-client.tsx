'use client';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function StockAdjustmentsClient() {
    const t = useTranslations('Inventory.adjustments');

    return (
        <div className="space-y-6">
            <BackButton fallbackUrl="/dashboard" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground">
                        {t('subtitle')}
                    </p>
                </div>
                <Link href="/dashboard/inventory/adjustments/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('newAdjustment')}
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border p-8 text-center text-muted-foreground">
                Stock adjustments list coming soon. Use &quot;New Adjustment&quot; to adjust stock.
            </div>
        </div>
    );
}
