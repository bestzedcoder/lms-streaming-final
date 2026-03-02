import { create } from "zustand";
import type { AuthUserInfoResponse } from "../@types/auth.types";
import { authService } from "../services/auth.service";

interface AuthState {
  user: AuthUserInfoResponse | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (user: AuthUserInfoResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUserInfoResponse>) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  login: (user) => {
    set({
      user: user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  updateUser: (updatedData) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updatedData } });
    }
  },

  checkAuth: async () => {
    try {
      const res = await authService.getMe();

      if (res.data) {
        set({
          user: res.data,
          isAuthenticated: true,
          isInitialized: true,
        });
      } else {
        set({ user: null, isAuthenticated: false, isInitialized: true });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },
}));
