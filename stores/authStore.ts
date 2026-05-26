import { create } from 'zustand';
import type { Profile, UserRole } from '@/types';

type AuthStore = {
  profile: Profile | null;
  activeRole: UserRole;
  setProfile: (profile: Profile | null) => void;
  setActiveRole: (role: UserRole) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  profile: null,
  activeRole: 'client',
  setProfile: (profile) => set({ profile }),
  setActiveRole: (role) => set({ activeRole: role }),
}));
