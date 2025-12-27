'use client';

import { useEffect, useMemo, useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { KanbanColumn } from '@/components/kanban/kanban-column';
import { KanbanCard, KanbanCardContent } from '@/components/kanban/kanban-card';
import { useCrmStore } from '@/lib/stores/crm-store';
import { Opportunity } from '@/lib/services/crm-service';
import { updateOpportunityAction } from '@/app/actions/crm-actions';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface KanbanViewProps {
    initialData: Opportunity[];
}

const STAGES = ['lead', 'qualified', 'won', 'lost'];

export function KanbanView({ initialData }: KanbanViewProps) {
    const { opportunities, setOpportunities, moveOpportunity } = useCrmStore();
    const t = useTranslations('CRM');
    const [activeDragItem, setActiveDragItem] = useState<Opportunity | null>(null);

    // Initialize store
    useEffect(() => {
        setOpportunities(initialData);
    }, [initialData, setOpportunities]);

    // Group opportunities by stage
    const columns = useMemo(() => {
        const cols: Record<string, Opportunity[]> = {
            lead: [],
            qualified: [],
            won: [],
            lost: []
        };

        opportunities.forEach(opp => {
            const stage = opp.stage?.toLowerCase() || 'lead';
            if (cols[stage]) {
                cols[stage].push(opp);
            } else {
                // Fallback for unknown stages
                cols['lead'].push(opp);
            }
        });

        return cols;
    }, [opportunities]);

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        const activeId = active.id as string;
        // The over.id could be a column ID (stage) or another card ID
        // If it's a card ID, we need to find its stage.
        // Simplified: We assume KanbnColumn uses the stage as its droppable ID.
        // But if we drop ON a card, we need to handle that.

        let newStage = over.id as string;

        // If dropping on a card, find that card's stage
        if (!STAGES.includes(newStage)) {
            const overCard = opportunities.find(o => o.id === newStage);
            if (overCard) {
                newStage = overCard.stage;
            }
        }

        const currentOpp = opportunities.find(o => o.id === activeId);

        if (currentOpp && currentOpp.stage !== newStage && STAGES.includes(newStage)) {
            const oldStage = currentOpp.stage;

            // Optimistic update
            moveOpportunity(activeId, newStage);
            toast.success(t('movedOpportunity', { name: currentOpp.name, stage: t(`stages.${newStage}`) }));

            // Server update
            try {
                const result = await updateOpportunityAction(activeId, { stage: newStage });
                if (!result) {
                    // Revert if failed (simple revert: set back to old stage)
                    moveOpportunity(activeId, oldStage);
                    toast.error(t('moveFailed'));
                }
            } catch (error) {
                console.error("Failed to move opportunity", error);
                moveOpportunity(activeId, oldStage);
                toast.error(t('moveFailed'));
            }
        }
    }

    // Custom overlay card for dragging visuals
    const ActiveOverlay = activeDragItem ? (
        <div className="w-[280px] cursor-grabbing">
            <div className="mb-3 rounded-lg border bg-card text-card-foreground shadow-xl">
                <KanbanCardContent>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm line-clamp-2">{activeDragItem.name}</h4>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <Badge variant="outline" className="text-xs">
                            ${activeDragItem.expectedRevenue?.toLocaleString() ?? 0}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {activeDragItem.probability}%
                        </span>
                    </div>
                </KanbanCardContent>
            </div>
        </div>
    ) : null;

    return (
        <div className="h-[calc(100vh-200px)] min-h-[500px]">
            <KanbanBoard onDragEnd={handleDragEnd} overlay={ActiveOverlay}>
                {STAGES.map(stage => (
                    <KanbanColumn
                        key={stage}
                        id={stage}
                        title={t(`stages.${stage}`)}
                        count={columns[stage].length}
                        className="w-[280px] min-w-[280px]"
                        items={columns[stage].map(o => o.id)}
                    >
                        {columns[stage].map(opp => (
                            <KanbanCard key={opp.id} id={opp.id}>
                                <KanbanCardContent>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm line-clamp-2">{opp.name}</h4>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <Badge variant="secondary" className="text-xs font-mono">
                                            ${opp.expectedRevenue?.toLocaleString() ?? 0}
                                        </Badge>
                                        <span className={
                                            opp.probability >= 70 ? "text-green-600 text-xs font-bold" :
                                                opp.probability >= 40 ? "text-yellow-600 text-xs" :
                                                    "text-red-500 text-xs"
                                        }>
                                            {opp.probability}%
                                        </span>
                                    </div>
                                    {opp.expectedCloseDate && (
                                        <div className="mt-2 text-[10px] text-muted-foreground">
                                            {new Date(opp.expectedCloseDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </KanbanCardContent>
                            </KanbanCard>
                        ))}
                    </KanbanColumn>
                ))}
            </KanbanBoard>
        </div>
    );
}
