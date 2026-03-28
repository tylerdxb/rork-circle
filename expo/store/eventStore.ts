import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event } from '@/types';
import { useAuthStore } from './authStore';

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Coffee Chat',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    duration: 60,
    location: 'Blue Bottle Coffee, Market St',
    description: 'Discussing potential collaboration opportunities',
    participantId: '2', // Alex Rivera
    chatId: '1',
  },
  {
    id: '2',
    title: 'Investment Meeting',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    duration: 90,
    location: 'Virtual (Zoom)',
    description: 'Discussing Series B funding options',
    participantId: '3', // Maya Johnson
    chatId: '2',
  },
];

interface EventState {
  events: Event[];
  getUserEvents: () => Event[];
  getChatEvents: (chatId: string) => Event[];
  addEvent: (event: Omit<Event, 'id'>) => string;
  updateEvent: (id: string, updates: Partial<Omit<Event, 'id'>>) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: mockEvents,
      
      getUserEvents: () => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) return [];
        
        const now = new Date();
        
        // Return events sorted by date (upcoming first)
        return get().events
          .filter(event => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      
      getChatEvents: (chatId) => {
        return get().events.filter(event => event.chatId === chatId);
      },
      
      addEvent: (event) => {
        const id = Date.now().toString();
        const newEvent = { ...event, id };
        
        set(state => ({
          events: [...state.events, newEvent]
        }));
        
        return id;
      },
      
      updateEvent: (id, updates) => {
        set(state => ({
          events: state.events.map(event => 
            event.id === id ? { ...event, ...updates } : event
          )
        }));
      },
      
      deleteEvent: (id) => {
        set(state => ({
          events: state.events.filter(event => event.id !== id)
        }));
      },
    }),
    {
      name: 'event-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);