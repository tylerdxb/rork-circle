import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ProfileFormData } from '@/types';
import { mockUsers } from '@/constants/mockData';

interface UserState {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User) => void;
  updateProfile: (data: Partial<ProfileFormData>) => void;
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: mockUsers,
      setCurrentUser: (user) => set({ currentUser: user }),
      updateProfile: (data) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        set({
          currentUser: {
            ...currentUser,
            ...data,
          },
        });
      },
      getUserById: (id) => {
        const { users, currentUser } = get();
        if (currentUser?.id === id) return currentUser;
        return users.find(user => user.id === id);
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);