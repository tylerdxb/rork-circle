import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, globalStyles } from '@/constants/theme';
import ProfileCard from '@/components/ProfileCard';
import Tag from '@/components/Tag';
import { useUserStore } from '@/store/userStore';
import { interests, cities } from '@/constants/mockData';
import { Filter, X } from 'lucide-react-native';

export default function DiscoverScreen() {
  const { users, currentUser } = useUserStore();
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  
  // Filter out current user and apply filters
  const filteredUsers = users.filter(user => {
    if (user.id === currentUser?.id) return false;
    
    if (selectedInterest && !user.interests.includes(selectedInterest)) {
      return false;
    }
    
    if (selectedCities.length > 0) {
      const cityName = cities.find(c => c.id === user.location)?.name || user.location;
      const matchesAnyCity = selectedCities.some(cityId => {
        const city = cities.find(c => c.id === cityId);
        return city && cityName === city.name;
      });
      
      if (!matchesAnyCity) {
        return false;
      }
    }
    
    return true;
  });
  
  const toggleInterest = (id: string) => {
    setSelectedInterest(prev => prev === id ? null : id);
  };
  
  const toggleCity = (id: string) => {
    setSelectedCities(prev => {
      if (prev.includes(id)) {
        return prev.filter(cityId => cityId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const clearFilters = () => {
    setSelectedInterest(null);
    setSelectedCities([]);
  };
  
  const removeCity = (id: string) => {
    setSelectedCities(prev => prev.filter(cityId => cityId !== id));
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Interests</Text>
            <FlatList
              data={interests.slice(0, 5)} // Show only first 5 interests
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Tag
                  label={item.name}
                  selected={selectedInterest === item.id}
                  onPress={() => toggleInterest(item.id)}
                  style={styles.filterTag}
                />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.filterList}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Cities</Text>
            <FlatList
              data={cities.slice(0, 5)} // Show only first 5 cities
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Tag
                  label={item.name}
                  selected={selectedCities.includes(item.id)}
                  onPress={() => toggleCity(item.id)}
                  style={styles.filterTag}
                />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.filterList}
            />
          </View>
          
          {selectedCities.length > 0 && (
            <View style={styles.selectedFiltersContainer}>
              <Text style={styles.selectedFiltersLabel}>Selected Cities:</Text>
              <View style={styles.selectedFilters}>
                {selectedCities.map(cityId => {
                  const city = cities.find(c => c.id === cityId);
                  if (!city) return null;
                  
                  return (
                    <View key={cityId} style={styles.selectedFilterTag}>
                      <Text style={styles.selectedFilterText}>{city.name}</Text>
                      <TouchableOpacity 
                        onPress={() => removeCity(cityId)}
                        style={styles.removeFilterButton}
                      >
                        <X size={12} color={theme.colors.text} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          
          {(selectedInterest || selectedCities.length > 0) && (
            <TouchableOpacity 
              style={styles.clearFilters}
              onPress={clearFilters}
            >
              <Filter size={14} color={theme.colors.primary} />
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => <ProfileCard user={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matches found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
  filtersContainer: {
    marginBottom: theme.spacing.sm,
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterLabel: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  filterList: {
    paddingVertical: theme.spacing.xs,
  },
  filterTag: {
    marginRight: theme.spacing.sm,
  },
  selectedFiltersContainer: {
    marginBottom: theme.spacing.md,
  },
  selectedFiltersLabel: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  selectedFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: theme.spacing.xs,
  },
  removeFilterButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  clearFiltersText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  list: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
  },
});