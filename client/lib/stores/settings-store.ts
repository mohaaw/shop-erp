import { create } from 'zustand';
import { updateSettingsAction } from '@/app/actions/settings-actions';

interface SettingsState {
    storeName: string;
    supportEmail: string | null;
    currency: string;
    timezone: string;
    primaryColor: string;
    secondaryColor: string;
    setSettings: (settings: Partial<SettingsState>) => void;
    updateSettings: (settings: Partial<SettingsState>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    storeName: 'ERP-SHOP',
    supportEmail: null,
    currency: 'usd',
    timezone: 'utc',
    primaryColor: '#3B82F6',
    secondaryColor: '#64748B',
    setSettings: (settings) => set((state) => ({ ...state, ...settings })),
    updateSettings: async (settings) => {
        // Optimistic update
        const currentState = useSettingsStore.getState();
        set((state) => ({ ...state, ...settings }));

        // Call server action
        try {
            await updateSettingsAction({
                storeName: settings.storeName ?? currentState.storeName,
                currency: settings.currency ?? currentState.currency,
                timezone: settings.timezone ?? currentState.timezone,
                supportEmail: settings.supportEmail ?? currentState.supportEmail ?? undefined,
                primaryColor: settings.primaryColor ?? currentState.primaryColor,
                secondaryColor: settings.secondaryColor ?? currentState.secondaryColor,
            });
        } catch (error) {
            console.error('Failed to update settings:', error);
            // Revert on failure (optional, but good practice)
        }
    },
}));
