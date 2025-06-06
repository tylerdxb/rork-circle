import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Interest } from '@/types';
import { theme, globalStyles } from '@/constants/theme';
import Tag from './Tag';
import { interests as allInterests } from '@/constants/mockData';
import { MapPin } from 'lucide-react-native';

interface ProfileCardProps {
  user: User;
  showDetails?: boolean;
  onPress?: () => void;
}

export default function ProfileCard({ 
  user, 
  showDetails = true,
  onPress 
}: ProfileCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/profile/${user.id}`);
    }
  };
  
  // Get interest objects from IDs
  const userInterests = user.interests
    .map(id => allInterests.find(interest => interest.id === id))
    .filter(interest => interest !== undefined) as Interest[];
  
  // Limit to 3 interests for display
  const displayInterests = userInterests.slice(0, 3);
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: user.photo }} 
        style={styles.photo}
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>
        
        <Text style={styles.headline} numberOfLines={1}>
          {user.headline}
        </Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={theme.colors.subtext} />
          <Text style={styles.location}>{user.location}</Text>
        </View>
        
        {showDetails && (
          <>
            <View style={styles.tagsContainer}>
              {displayInterests.map(interest => (
                <Tag 
                  key={interest.id} 
                  label={interest.name} 
                  disabled 
                />
              ))}
              
              {userInterests.length > 3 && (
                <Text style={styles.moreText}>
                  +{userInterests.length - 3} more
                </Text>
              )}
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    ...theme.typography.h3,
    marginBottom: 2,
  },
  headline: {
    ...theme.typography.bodySmall,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  location: {
    ...theme.typography.bodySmall,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  moreText: {
    ...theme.typography.bodySmall,
    alignSelf: 'center',
  },
});