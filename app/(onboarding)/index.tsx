import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronLeft } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import { completeOnboarding } from '@/store/authStore';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { currentUser, updateProfile } = useUserStore();
  
  const [photo, setPhoto] = useState(currentUser?.photo || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [headline, setHeadline] = useState(currentUser?.headline || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  
  const [errors, setErrors] = useState({
    photo: '',
    name: '',
    headline: '',
    location: '',
    bio: '',
  });
  
  const [loading, setLoading] = useState(false);
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };
  
  const handleNext = () => {
    // Validate inputs
    let hasError = false;
    const newErrors = {
      photo: '',
      name: '',
      headline: '',
      location: '',
      bio: '',
    };
    
    if (!photo) {
      newErrors.photo = 'Please add a profile photo';
      hasError = true;
    }
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    }
    
    if (!headline.trim()) {
      newErrors.headline = 'Headline is required';
      hasError = true;
    }
    
    if (!location.trim()) {
      newErrors.location = 'Location is required';
      hasError = true;
    }
    
    if (!bio.trim()) {
      newErrors.bio = 'Bio is required';
      hasError = true;
    } else if (bio.length > 200) {
      newErrors.bio = 'Bio must be 200 characters or less';
      hasError = true;
    }
    
    setErrors(newErrors);
    if (hasError) return;
    
    // Save profile data
    updateProfile({
      photo,
      name,
      headline,
      location,
      bio,
    });
    
    // Navigate to next onboarding step
    router.push('/(onboarding)/interests');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Your Profile</Text>
            <Text style={styles.subtitle}>
              Tell us about yourself so others can get to know you
            </Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.photoContainer}>
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={pickImage}
              >
                {photo ? (
                  <Image 
                    source={{ uri: photo }}
                    style={styles.photo}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Camera size={32} color={theme.colors.subtext} />
                  </View>
                )}
              </TouchableOpacity>
              
              <Text style={styles.photoLabel}>Profile Photo</Text>
              {errors.photo ? <Text style={styles.errorText}>{errors.photo}</Text> : null}
            </View>
            
            <Input
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Your full name"
              label="Name"
              error={errors.name}
              autoCapitalize="words"
            />
            
            <Input
              value={headline}
              onChangeText={(text) => {
                setHeadline(text);
                if (errors.headline) setErrors(prev => ({ ...prev, headline: '' }));
              }}
              placeholder="e.g. Founder & CEO at Company"
              label="Headline"
              error={errors.headline}
            />
            
            <Input
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
              }}
              placeholder="e.g. New York, London, Dubai"
              label="Location"
              error={errors.location}
            />
            
            <Input
              value={bio}
              onChangeText={(text) => {
                setBio(text);
                if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
              }}
              placeholder="Tell others about yourself (max 200 characters)"
              label={`Bio (${bio.length}/200)`}
              error={errors.bio}
              multiline
              numberOfLines={4}
              maxLength={200}
              inputStyle={styles.bioInput}
            />
            
            <Button
              title="Next"
              onPress={handleNext}
              loading={loading}
              fullWidth
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoLabel: {
    ...theme.typography.bodySmall,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});