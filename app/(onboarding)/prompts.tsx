import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { prompts } from '@/constants/mockData';
import { useUserStore } from '@/store/userStore';
import { UserPrompt } from '@/types';
import { completeOnboarding } from '@/store/authStore';
import { ChevronLeft } from 'lucide-react-native';

export default function PromptsScreen() {
  const router = useRouter();
  const { currentUser, updateProfile } = useUserStore();
  
  // Select 2 random prompts if not already selected
  const initialPrompts = currentUser?.prompts || [
    { promptId: prompts[0].id, answer: '' },
    { promptId: prompts[1].id, answer: '' },
  ];
  
  const [userPrompts, setUserPrompts] = useState<UserPrompt[]>(initialPrompts);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const updatePromptAnswer = (index: number, answer: string) => {
    const updatedPrompts = [...userPrompts];
    updatedPrompts[index] = {
      ...updatedPrompts[index],
      answer,
    };
    setUserPrompts(updatedPrompts);
    setError('');
  };
  
  const handleFinish = () => {
    // Validate answers
    if (userPrompts.some(prompt => !prompt.answer.trim())) {
      setError('Please answer all prompts');
      return;
    }
    
    setLoading(true);
    
    // Save prompts
    updateProfile({
      prompts: userPrompts,
    });
    
    // Complete onboarding
    setTimeout(() => {
      completeOnboarding();
      setLoading(false);
    }, 1000);
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
          <Text style={styles.title}>Tell Your Story</Text>
          <Text style={styles.subtitle}>
            Answer these prompts to help others get to know you better
          </Text>
        </View>
        
        <View style={styles.form}>
          {userPrompts.map((userPrompt, index) => {
            const prompt = prompts.find(p => p.id === userPrompt.promptId);
            if (!prompt) return null;
            
            return (
              <Input
                key={prompt.id}
                value={userPrompt.answer}
                onChangeText={(text) => updatePromptAnswer(index, text)}
                placeholder="Your answer..."
                label={prompt.text}
                multiline
                numberOfLines={3}
                inputStyle={styles.promptInput}
              />
            );
          })}
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Button
            title="Finish"
            onPress={handleFinish}
            loading={loading}
            fullWidth
            style={styles.button}
          />
        </View>
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
  form: {
    marginBottom: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
  promptInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});