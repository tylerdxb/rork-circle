import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, Message } from '@/types';
import { mockChats } from '@/constants/mockData';
import { useAuthStore } from './authStore';

interface ChatState {
  chats: Chat[];
  getUserChats: () => Chat[];
  getChatWithUser: (userId: string) => Chat | undefined;
  sendMessage: (chatId: string, text: string) => void;
  createChat: (userId: string) => string;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: mockChats,
      
      getUserChats: () => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) return [];
        
        return get().chats.filter(chat => 
          chat.participants.includes(currentUserId)
        );
      },
      
      getChatWithUser: (userId) => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) return undefined;
        
        return get().chats.find(chat => 
          chat.participants.includes(currentUserId) && 
          chat.participants.includes(userId)
        );
      },
      
      sendMessage: (chatId, text) => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) return;
        
        const newMessage: Message = {
          id: Date.now().toString(),
          senderId: currentUserId,
          text,
          timestamp: new Date().toISOString(),
        };
        
        set(state => ({
          chats: state.chats.map(chat => 
            chat.id === chatId 
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          )
        }));
      },
      
      createChat: (userId) => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) throw new Error("User not authenticated");
        
        // Check if chat already exists
        const existingChat = get().getChatWithUser(userId);
        if (existingChat) return existingChat.id;
        
        // Create new chat
        const newChatId = Date.now().toString();
        const newChat: Chat = {
          id: newChatId,
          participants: [currentUserId, userId],
          messages: [],
        };
        
        set(state => ({
          chats: [...state.chats, newChat]
        }));
        
        return newChatId;
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);