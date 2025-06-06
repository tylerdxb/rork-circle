import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import { useChatStore } from '@/store/chatStore';
import { useUserStore } from '@/store/userStore';
import { format } from '@/utils/dateFormat';

export default function MessagesScreen() {
  const router = useRouter();
  const { getUserChats } = useChatStore();
  const { getUserById } = useUserStore();
  
  const chats = getUserChats();
  
  const navigateToChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const lastMessage = item.messages[item.messages.length - 1];
          if (!lastMessage) return null;
          
          // Get the other user in the chat
          const otherUserId = item.participants.find(
            id => id !== useUserStore.getState().currentUser?.id
          );
          if (!otherUserId) return null;
          
          const otherUser = getUserById(otherUserId);
          if (!otherUser) return null;
          
          return (
            <TouchableOpacity 
              style={styles.chatItem}
              onPress={() => navigateToChat(item.id)}
            >
              <Image 
                source={{ uri: otherUser.photo }}
                style={styles.avatar}
              />
              
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.userName}>{otherUser.name}</Text>
                  <Text style={styles.timestamp}>
                    {format(new Date(lastMessage.timestamp))}
                  </Text>
                </View>
                
                <Text 
                  style={styles.lastMessage}
                  numberOfLines={1}
                >
                  {lastMessage.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Connect with people and start conversations
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
  },
  list: {
    padding: theme.spacing.md,
  },
  chatItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  timestamp: {
    ...theme.typography.bodySmall,
    fontSize: 12,
  },
  lastMessage: {
    ...theme.typography.bodySmall,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    textAlign: 'center',
  },
});