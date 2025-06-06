import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore, setInviteCode, login } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { mockUsers } from '@/constants/mockData';

export default function InviteCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Please enter an invite code');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to validate invite code
    setTimeout(() => {
      // For demo purposes, any code is valid
      setInviteCode(code);
      
      // Set a mock user as the current user
      // In a real app, this would come from the backend
      const mockUser = mockUsers[0];
      login(mockUser.id);
      useUserStore.getState().setCurrentUser(mockUser);
      
      setLoading(false);
      router.replace('/(onboarding)');
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter Invite Code</Text>
          <Text style={styles.subtitle}>
            Circle is currently in private beta. Please enter your invite code to continue.
          </Text>
        </View>
        
        <View style={styles.form}>
          <Input
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setError('');
            }}
            placeholder="Enter your invite code"
            label="Invite Code"
            error={error}
            autoCapitalize="characters"
          />
          
          <Button
            title="Continue"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.button}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an invite code?{' '}
            <Text style={styles.footerLink}>Request access</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.subtext,
  },
  form: {
    marginVertical: theme.spacing.xl,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  footer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.bodySmall,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});