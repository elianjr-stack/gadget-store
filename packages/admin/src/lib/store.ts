import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUserState {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
}

interface AdminStoreState {
  token: string | null;
  admin: AdminUserState | null;
  setAuth: (admin: AdminUserState, token: string) => void;
  logout: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      setAuth: (admin, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token);
        }
        set({ admin, token });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
        }
        set({ admin: null, token: null });
      },
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'gadgetstore-admin-auth',
      partialize: (state) => ({ token: state.token, admin: state.admin }),
    }
  )
);
