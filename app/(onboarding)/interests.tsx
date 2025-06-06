import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import Button from '@/components/Button';
import Tag from '@/components/Tag';
import { interests, intents } from '@/constants/mockData';
import { useUserStore } from '@/store/userStore';
import { ChevronLeft } from 'lucide-react-native';

export default function InterestsScreen() {
  const router = useRouter();
  const { currentUser, updateProfile } = useUserStore();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests || []
  );
  const [selectedIntents, setSelectedIntents] = useState<string[]>(
    currentUser?.intents || []
  );
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
    setError('');
  };
  
  const toggleIntent = (id: string) => {
    setSelectedIntents(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
    setError('');
  };
  
  const handleNext = () => {
    if (selectedInterests.length === 0 || selectedIntents.length === 0) {
      setError('Please select at least one interest and one intent');
      return;
    }
    
    // Save selections
    updateProfile({
      interests: selectedInterests,
      intents: selectedIntents,
    });
    
    // Navigate to next onboarding step
    router.push('/(onboarding)/prompts');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Your Interests & Intent</Text>
          <Text style={styles.subtitle}>
            Select topics you're interested in and what you're looking for on Circle
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text style={styles.sectionSubtitle}>
            Select topics you're passionate about
          </Text>
          
          <View style={styles.tagsContainer}>
            {interests.map(interest => (
              <Tag
                key={interest.id}
                label={interest.name}
                selected={selectedInterests.includes(interest.id)}
                onPress={() => toggleInterest(interest.id)}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intent</Text>
          <Text style={styles.sectionSubtitle}>
            What are you looking for on Circle?
          </Text>
          
          <View style={styles.tagsContainer}>
            {intents.map(intent => (
              <Tag
                key={intent.id}
                label={intent.name}
                selected={selectedIntents.includes(intent.id)}
                onPress={() => toggleIntent(intent.id)}
              />
            ))}
          </View>
        </View>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Button
          title="Next"
          onPress={handleNext}
          loading={loading}
          fullWidth
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    padding: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.subtext,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    ...theme.typography.bodySmall,
    marginBottom: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});