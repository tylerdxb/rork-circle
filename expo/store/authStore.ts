import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isOnboarded: false,
      userId: null,
      inviteCode: null,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const login = (userId: string) => {
  useAuthStore.setState({ isAuthenticated: true, userId });
};

export const logout = () => {
  useAuthStore.setState({ isAuthenticated: false, userId: null });
};

export const completeOnboarding = () => {
  useAuthStore.setState({ isOnboarded: true });
};

export const setInviteCode = (inviteCode: string) => {
  useAuthStore.setState({ inviteCode });
};