import { create } from 'zustand';

interface SettingsState {
    storeName: string;
    setStoreName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    storeName: 'ERP-SHOP',
    setStoreName: (name) => set({ storeName: name }),
}));
