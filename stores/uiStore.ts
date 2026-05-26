import { create } from 'zustand';

type UIStore = {
  activeFilterCategory: string | null;
  activeFilterZone: string | null;
  setFilterCategory: (slug: string | null) => void;
  setFilterZone: (zone: string | null) => void;
  clearFilters: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  activeFilterCategory: null,
  activeFilterZone: null,
  setFilterCategory: (slug) => set({ activeFilterCategory: slug }),
  setFilterZone: (zone) => set({ activeFilterZone: zone }),
  clearFilters: () => set({ activeFilterCategory: null, activeFilterZone: null }),
}));
