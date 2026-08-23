import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '../types';

interface RoleStore {
  currentRole: Role | null;
  currentUser: User | null;
  setRole: (role: Role, user: User) => void;
  logout: () => void;
}

export const useRoleStore = create<RoleStore>()(
  persist(
    (set) => ({
      currentRole: null,
      currentUser: null,
      setRole: (role, user) => set({ currentRole: role, currentUser: user }),
      logout: () => set({ currentRole: null, currentUser: null }),
    }),
    {
      name: 'mara-role-storage',
    }
  )
);
