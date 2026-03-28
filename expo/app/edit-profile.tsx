import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ChevronLeft } from 'lucide-react-native';
import { useUserStore } from '@/store/userStore';
import Tag from '@/components/Tag';
import { interests, intents } from '@/constants/mockData';

export default function EditProfileScreen() {
  const router = useRouter();
  const { currentUser, updateProfile } = useUserStore();
  
  const [photo, setPhoto] = useState(currentUser?.photo || '');
  const [name, setName] = useState(currentUser?.name || '');
  const [headline, setHeadline] = useState(currentUser?.headline || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests || []
  );
  const [selectedIntents, setSelectedIntents] = useState<string[]>(
    currentUser?.intents || []
  );
  
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
  
  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const toggleIntent = (id: string) => {
    setSelectedIntents(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleSave = () => {
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
    
    if (selectedInterests.length === 0) {
      hasError = true;
      // Show an error message
    }
    
    if (selectedIntents.length === 0) {
      hasError = true;
      // Show an error message
    }
    
    setErrors(newErrors);
    if (hasError) return;
    
    setLoading(true);
    
    // Save profile data
    updateProfile({
      photo,
      name,
      headline,
      location,
      bio,
      interests: selectedInterests,
      intents: selectedIntents,
    });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 1000);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Edit Profile",
          headerShown: true,
          headerTitleStyle: { color: theme.colors.text },
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerBackTitle: "Back"
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
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
              
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={loading}
                fullWidth
                style={styles.button}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
  button: {
    marginTop: theme.spacing.lg,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});