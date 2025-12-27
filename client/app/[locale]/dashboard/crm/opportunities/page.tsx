import { getOpportunitiesAction } from '@/app/actions/crm-actions';
import { KanbanView } from './kanban-view';

import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default async function OpportunitiesPage() {
    const opportunities = await getOpportunitiesAction();
    const t = await getTranslations('CRM');

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t('opportunities')}</h2>
                    <p className="text-muted-foreground">
                        {t('opportunitiesDescription')}
                    </p>
                </div>
                <Link href="/dashboard/crm/opportunities/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('addOpportunity')}
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanView initialData={opportunities} />
            </div>
        </div>
    );
}
