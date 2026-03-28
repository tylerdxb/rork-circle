import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { interests as allInterests, intents as allIntents, prompts as allPrompts } from '@/constants/mockData';
import Tag from '@/components/Tag';
import ConnectionButton from '@/components/ConnectionButton';
import { MapPin } from 'lucide-react-native';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getUserById } = useUserStore();
  
  const user = getUserById(id);
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get interest and intent objects from IDs
  const userInterests = user.interests
    .map(id => allInterests.find(interest => interest.id === id))
    .filter(interest => interest !== undefined);
  
  const userIntents = user.intents
    .map(id => allIntents.find(intent => intent.id === id))
    .filter(intent => intent !== undefined);
  
  // Get prompt texts
  const userPrompts = user.prompts.map(userPrompt => {
    const prompt = allPrompts.find(p => p.id === userPrompt.promptId);
    return {
      question: prompt?.text || '',
      answer: userPrompt.answer,
    };
  });
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: user.name,
          headerTitleStyle: { color: theme.colors.text },
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerBackTitle: "Back"
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image 
              source={{ uri: user.photo }}
              style={styles.profilePhoto}
            />
            
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.headline}>{user.headline}</Text>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.colors.subtext} />
              <Text style={styles.location}>{user.location}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{user.bio}</Text>
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
          
          <View style={styles.actionContainer}>
            <ConnectionButton userId={user.id} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
    marginBottom: theme.spacing.xl,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
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
  },
  location: {
    ...theme.typography.bodySmall,
    marginLeft: 4,
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
  actionContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
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