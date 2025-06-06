import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';
import { useAuthStore, logout } from '@/store/authStore';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight,
  LogOut
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [visibilityEnabled, setVisibilityEnabled] = React.useState(true);
  
  const handleLogout = () => {
    logout();
  };
  
  const navigateToEditProfile = () => {
    router.push('/edit-profile');
  };
  
  if (!currentUser) return null;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileSection}
          onPress={navigateToEditProfile}
        >
          <Image 
            source={{ uri: currentUser.photo }}
            style={styles.profilePhoto}
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileHeadline}>{currentUser.headline}</Text>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <User size={20} color={theme.colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Profile Visibility</Text>
              <Text style={styles.settingDescription}>
                When off, your profile won't be shown to others
              </Text>
            </View>
            <Switch
              value={visibilityEnabled}
              onValueChange={setVisibilityEnabled}
              trackColor={{ false: theme.colors.inactive, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={theme.colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy & Security</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={theme.colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive alerts for new connections and messages
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.colors.inactive, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <HelpCircle size={20} color={theme.colors.text} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={theme.colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.settingItem, styles.logoutButton]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Circle v1.0.0</Text>
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
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.h2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  profilePhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.h3,
    marginBottom: 2,
  },
  profileHeadline: {
    ...theme.typography.bodySmall,
    marginBottom: theme.spacing.xs,
  },
  editProfileText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingTitle: {
    ...theme.typography.body,
    marginBottom: 2,
  },
  settingDescription: {
    ...theme.typography.bodySmall,
  },
  logoutButton: {
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    borderBottomWidth: 0,
  },
  logoutText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginLeft: theme.spacing.md,
  },
  versionText: {
    ...theme.typography.bodySmall,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});