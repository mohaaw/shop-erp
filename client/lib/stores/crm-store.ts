import { create } from 'zustand';
import { Opportunity } from '@/lib/services/crm-service';

interface CrmStore {
    opportunities: Opportunity[];
    setOpportunities: (opportunities: Opportunity[]) => void;
    moveOpportunity: (id: string, newStage: string) => void;
    updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
    addOpportunity: (opportunity: Opportunity) => void;
    removeOpportunity: (id: string) => void;
}

export const useCrmStore = create<CrmStore>((set) => ({
    opportunities: [],
    setOpportunities: (opportunities) => set({ opportunities }),

    moveOpportunity: (id, newStage) =>
        set((state) => ({
            opportunities: state.opportunities.map((opp) =>
                opp.id === id ? { ...opp, stage: newStage, updatedAt: new Date().toISOString() } : opp
            ),
        })),

    updateOpportunity: (id, updates) =>
        set((state) => ({
            opportunities: state.opportunities.map((opp) =>
                opp.id === id ? { ...opp, ...updates } : opp
            ),
        })),

    addOpportunity: (opportunity) =>
        set((state) => ({
            opportunities: [opportunity, ...state.opportunities],
        })),

    removeOpportunity: (id) =>
        set((state) => ({
            opportunities: state.opportunities.filter((opp) => opp.id !== id),
        })),
}));
