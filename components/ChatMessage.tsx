import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { format } from '@/utils/dateFormat';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { userId } = useAuthStore();
  const isCurrentUser = message.senderId === userId;
  
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
      <Text style={styles.timestamp}>{format(new Date(message.timestamp))}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginBottom: theme.spacing.md,
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  currentUserBubble: {
    backgroundColor: theme.colors.primary,
  },
  otherUserBubble: {
    backgroundColor: theme.colors.card,
  },
  messageText: {
    color: theme.colors.text,
  },
  timestamp: {
    ...theme.typography.bodySmall,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});