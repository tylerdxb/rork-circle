import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useConnectionStore } from '@/store/connectionStore';
import { useEventStore } from '@/store/eventStore';
import { interests as allInterests, intents as allIntents, prompts as allPrompts } from '@/constants/mockData';
import Tag from '@/components/Tag';
import { MapPin, Calendar, Users, Edit3 } from 'lucide-react-native';
import CalendarView from '@/components/CalendarView';
import EventItem from '@/components/EventItem';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { getCurrentUserConnections } = useConnectionStore();
  const { getUserEvents } = useEventStore();
  
  const [activeTab, setActiveTab] = useState<'about' | 'calendar'>('about');
  
  const userConnections = getCurrentUserConnections();
  const connectionCount = userConnections?.connections.length || 0;
  
  const userEvents = getUserEvents();
  
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get interest and intent objects from IDs
  const userInterests = currentUser.interests
    .map(id => allInterests.find(interest => interest.id === id))
    .filter(interest => interest !== undefined);
  
  const userIntents = currentUser.intents
    .map(id => allIntents.find(intent => intent.id === id))
    .filter(intent => intent !== undefined);
  
  // Get prompt texts
  const userPrompts = currentUser.prompts.map(userPrompt => {
    const prompt = allPrompts.find(p => p.id === userPrompt.promptId);
    return {
      question: prompt?.text || '',
      answer: userPrompt.answer,
    };
  });
  
  const navigateToEditProfile = () => {
    router.push('/edit-profile');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Image 
              source={{ uri: currentUser.photo }}
              style={styles.profilePhoto}
            />
            
            <TouchableOpacity 
              style={styles.editButton}
              onPress={navigateToEditProfile}
            >
              <Edit3 size={18} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.headline}>{currentUser.headline}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={theme.colors.subtext} />
            <Text style={styles.location}>{currentUser.location}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Users size={16} color={theme.colors.primary} />
              <Text style={styles.statText}>{connectionCount} Connections</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'about' && styles.activeTab
            ]}
            onPress={() => setActiveTab('about')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'about' && styles.activeTabText
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'calendar' && styles.activeTab
            ]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'calendar' && styles.activeTabText
              ]}
            >
              Calendar
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'about' ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{currentUser.bio}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.tagsContainer}>
                {userInterests.map(interest => (
                  <Tag 
                    key={interest?.id} 
                    label={interest?.name || ''} 
                    disabled 
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Looking for</Text>
              <View style={styles.tagsContainer}>
                {userIntents.map(intent => (
                  <Tag 
                    key={intent?.id} 
                    label={intent?.name || ''} 
                    disabled 
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Get to know me</Text>
              {userPrompts.map((prompt, index) => (
                <View key={index} style={styles.promptContainer}>
                  <Text style={styles.promptQuestion}>{prompt.question}</Text>
                  <Text style={styles.promptAnswer}>{prompt.answer}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <Calendar size={20} color={theme.colors.primary} />
              <Text style={styles.calendarTitle}>Upcoming Events</Text>
            </View>
            
            <CalendarView events={userEvents} />
            
            <View style={styles.eventsListContainer}>
              <Text style={styles.eventsListTitle}>Scheduled Meetups</Text>
              
              {userEvents.length > 0 ? (
                userEvents.map(event => (
                  <EventItem key={event.id} event={event} />
                ))
              ) : (
                <View style={styles.emptyEventsContainer}>
                  <Text style={styles.emptyEventsText}>No upcoming events</Text>
                  <Text style={styles.emptyEventsSubtext}>
                    Schedule meetups with your connections through the Messages tab
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTop: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  name: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.xs,
  },
  headline: {
    ...theme.typography.body,
    color: theme.colors.subtext,
    marginBottom: theme.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  location: {
    ...theme.typography.bodySmall,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  statText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  tab: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginRight: theme.spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    ...theme.typography.body,
    color: theme.colors.subtext,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  bio: {
    ...theme.typography.body,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promptContainer: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
  },
  promptQuestion: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  promptAnswer: {
    ...theme.typography.body,
  },
  calendarSection: {
    marginBottom: theme.spacing.xl,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  calendarTitle: {
    ...theme.typography.h3,
    marginLeft: theme.spacing.sm,
  },
  eventsListContainer: {
    marginTop: theme.spacing.lg,
  },
  eventsListTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.md,
  },
  emptyEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
  },
  emptyEventsText: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  emptyEventsSubtext: {
    ...theme.typography.bodySmall,
    textAlign: 'center',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    ...theme.typography.h2,
  },
});