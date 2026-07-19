import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userName: string | null;
  userId: string | null;
  workspaceId: string | null;
  login: (name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userName: null as string | null,
      userId: null as string | null,
      workspaceId: null as string | null,
      login: async (name: string) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
          });
          if (res.ok) {
            const data = await res.json();
            set({ 
              isAuthenticated: true, 
              userName: data.user.name,
              userId: data.user.id,
              workspaceId: data.workspaces[0]?.id || '1'
            });
          } else {
            throw new Error('Invalid credentials or server error');
          }
        } catch (error) {
          console.error("Login failed", error);
          throw error;
        }
      },
      logout: () => set({ isAuthenticated: false, userName: null, userId: null, workspaceId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
