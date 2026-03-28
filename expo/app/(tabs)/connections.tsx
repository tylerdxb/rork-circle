import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import ProfileCard from '@/components/ProfileCard';
import { useUserStore } from '@/store/userStore';
import { useConnectionStore } from '@/store/connectionStore';
import { User } from '@/types';

type TabType = 'connections' | 'pending' | 'received';

export default function ConnectionsScreen() {
  const { users } = useUserStore();
  const { 
    getCurrentUserConnections,
    acceptConnectionRequest,
    rejectConnectionRequest,
  } = useConnectionStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('connections');
  
  const userConnections = getCurrentUserConnections();
  
  const getUsers = (ids: string[]): User[] => {
    return ids
      .map(id => users.find(user => user.id === id))
      .filter(user => user !== undefined) as User[];
  };
  
  const connectionUsers = userConnections 
    ? getUsers(userConnections.connections)
    : [];
  
  const pendingUsers = userConnections 
    ? getUsers(userConnections.pending)
    : [];
  
  const receivedUsers = userConnections 
    ? getUsers(userConnections.received)
    : [];
  
  const displayUsers = activeTab === 'connections' 
    ? connectionUsers 
    : activeTab === 'pending' 
      ? pendingUsers 
      : receivedUsers;
  
  const handleAccept = (userId: string) => {
    acceptConnectionRequest(userId);
  };
  
  const handleReject = (userId: string) => {
    rejectConnectionRequest(userId);
  };
  
  const renderItem = ({ item }: { item: User }) => {
    if (activeTab === 'received') {
      return (
        <View style={styles.requestCard}>
          <ProfileCard user={item} showDetails={false} />
          <View style={styles.requestActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.rejectButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => handleAccept(item.id)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    return <ProfileCard user={item} />;
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Circle</Text>
        
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'connections' && styles.activeTab
            ]}
            onPress={() => setActiveTab('connections')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'connections' && styles.activeTabText
              ]}
            >
              Connections
            </Text>
            {connectionUsers.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{connectionUsers.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'pending' && styles.activeTab
            ]}
            onPress={() => setActiveTab('pending')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'pending' && styles.activeTabText
              ]}
            >
              Sent
            </Text>
            {pendingUsers.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingUsers.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'received' && styles.activeTab
            ]}
            onPress={() => setActiveTab('received')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'received' && styles.activeTabText
              ]}
            >
              Requests
            </Text>
            {receivedUsers.length > 0 && (
              <View style={[styles.badge, styles.activeBadge]}>
                <Text style={styles.badgeText}>{receivedUsers.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={displayUsers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'connections' 
                ? "You don't have any connections yet" 
                : activeTab === 'pending' 
                  ? "You haven't sent any requests" 
                  : "You don't have any pending requests"}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'connections' 
                ? "Discover and connect with people" 
                : activeTab === 'pending' 
                  ? "Send connection requests to grow your circle" 
                  : "When someone wants to connect, you'll see it here"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
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
  badge: {
    backgroundColor: theme.colors.inactive,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xs,
    paddingHorizontal: 4,
  },
  activeBadge: {
    backgroundColor: theme.colors.primary,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: theme.spacing.lg,
  },
  requestCard: {
    marginBottom: theme.spacing.md,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  rejectButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  acceptButton: {
    backgroundColor: theme.colors.primary,
  },
  rejectButtonText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    textAlign: 'center',
  },
});