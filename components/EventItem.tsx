import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme, globalStyles } from '@/constants/theme';
import { Event } from '@/types';
import { useUserStore } from '@/store/userStore';
import { MapPin, Clock, User } from 'lucide-react-native';
import { Image } from 'expo-image';

interface EventItemProps {
  event: Event;
  onPress?: () => void;
}

export default function EventItem({ event, onPress }: EventItemProps) {
  const { getUserById } = useUserStore();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  // Get the other user in the event
  const otherUser = getUserById(event.participantId);
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{formatDate(event.date)}</Text>
        <Text style={styles.time}>{formatTime(event.date)}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.detailsContainer}>
          {event.location && (
            <View style={styles.detailItem}>
              <MapPin size={14} color={theme.colors.subtext} />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <Clock size={14} color={theme.colors.subtext} />
            <Text style={styles.detailText}>{event.duration} min</Text>
          </View>
          
          {otherUser && (
            <View style={styles.participantContainer}>
              <User size={14} color={theme.colors.subtext} />
              <Text style={styles.detailText}>With </Text>
              <Image 
                source={{ uri: otherUser.photo }}
                style={styles.participantPhoto}
              />
              <Text style={styles.participantName}>{otherUser.name}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.card,
    flexDirection: 'row',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  dateContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    minWidth: 80,
  },
  date: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  time: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  detailsContainer: {
    gap: theme.spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...theme.typography.bodySmall,
    marginLeft: 4,
  },
  participantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantPhoto: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  participantName: {
    ...theme.typography.bodySmall,
    fontWeight: '500',
  },
});