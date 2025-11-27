import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock login - replace with actual API call
      if (email === 'admin@example.com' && password === 'password123') {
        const mockUser: User = {
          id: 'admin001',
          email,
          name: 'Admin User',
          role: 'admin',
          permissions: ['*'],
        };
        const mockToken = 'mock-token-123';
        
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        set({ user: mockUser, token: mockToken });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  setUser: (user: User) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },
}));
