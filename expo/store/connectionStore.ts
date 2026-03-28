import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserConnections } from '@/types';
import { mockConnections } from '@/constants/mockData';
import { useAuthStore } from './authStore';

interface ConnectionState {
  connections: UserConnections[];
  getCurrentUserConnections: () => UserConnections | undefined;
  sendConnectionRequest: (userId: string) => void;
  acceptConnectionRequest: (userId: string) => void;
  rejectConnectionRequest: (userId: string) => void;
  isConnected: (userId: string) => boolean;
  isPending: (userId: string) => boolean;
  hasReceivedRequest: (userId: string) => boolean;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      connections: mockConnections,
      
      getCurrentUserConnections: () => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return undefined;
        
        const userConnections = get().connections.find(c => c.userId === userId);
        if (userConnections) return userConnections;
        
        // Create new connections object if it doesn't exist
        const newConnections = {
          userId,
          connections: [],
          pending: [],
          received: [],
        };
        
        set(state => ({
          connections: [...state.connections, newConnections]
        }));
        
        return newConnections;
      },
      
      sendConnectionRequest: (userId) => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) return;
        
        set(state => {
          // Update current user's pending list
          const updatedConnections = state.connections.map(conn => {
            if (conn.userId === currentUserId) {
              return {
                ...conn,
                pending: [...conn.pending, userId]
              };
            }
            return conn;
          });
          
          // Check if target user exists in connections
          const targetUserConn = updatedConnections.find(conn => conn.userId === userId);
          
          if (targetUserConn) {
            // Update target user's received list
            return {
              connections: updatedConnections.map(conn => 
                conn.userId === userId 
                  ? { ...conn, received: [...conn.received, currentUserId] }
                  : conn
              )
            };
          } else {
            // Create new connection for target user
            return {
              connections: [
                ...updatedConnections,
                {
                  userId,
                  connections: [],
                  pending: [],
                  received: [currentUserId]
                }
              ]
            };
          }
        });
      },
      
      acceptConnectionRequest: (userId) => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) return;
        
        set(state => {
          // Update current user's connections and received lists
          const updatedConnections = state.connections.map(conn => {
            if (conn.userId === currentUserId) {
              return {
                ...conn,
                connections: [...conn.connections, userId],
                received: conn.received.filter(id => id !== userId)
              };
            }
            return conn;
          });
          
          // Update other user's connections and pending lists
          return {
            connections: updatedConnections.map(conn => 
              conn.userId === userId 
                ? { 
                    ...conn, 
                    connections: [...conn.connections, currentUserId],
                    pending: conn.pending.filter(id => id !== currentUserId)
                  }
                : conn
            )
          };
        });
      },
      
      rejectConnectionRequest: (userId) => {
        const currentUserId = useAuthStore.getState().userId;
        if (!currentUserId) return;
        
        set(state => ({
          connections: state.connections.map(conn => {
            if (conn.userId === currentUserId) {
              return {
                ...conn,
                received: conn.received.filter(id => id !== userId)
              };
            }
            if (conn.userId === userId) {
              return {
                ...conn,
                pending: conn.pending.filter(id => id !== currentUserId)
              };
            }
            return conn;
          })
        }));
      },
      
      isConnected: (userId) => {
        const userConnections = get().getCurrentUserConnections();
        if (!userConnections) return false;
        return userConnections.connections.includes(userId);
      },
      
      isPending: (userId) => {
        const userConnections = get().getCurrentUserConnections();
        if (!userConnections) return false;
        return userConnections.pending.includes(userId);
      },
      
      hasReceivedRequest: (userId) => {
        const userConnections = get().getCurrentUserConnections();
        if (!userConnections) return false;
        return userConnections.received.includes(userId);
      },
    }),
    {
      name: 'connection-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);