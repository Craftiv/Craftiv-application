import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function ProjectsScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const projects = [
    { id: 1, name: 'Social Media Post', thumbnail: '🎨', date: '2 hours ago', type: 'social' },
    { id: 2, name: 'Business Card', thumbnail: '💼', date: '1 day ago', type: 'business' },
    { id: 3, name: 'Instagram Story', thumbnail: '📱', date: '3 days ago', type: 'social' },
    { id: 4, name: 'Flyer Design', thumbnail: '📄', date: '1 week ago', type: 'marketing' },
    { id: 5, name: 'Logo Design', thumbnail: '🏢', date: '2 weeks ago', type: 'business' },
    { id: 6, name: 'Banner Ad', thumbnail: '📢', date: '3 weeks ago', type: 'marketing' },
  ];

  const filters = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'social', name: 'Social', icon: 'share-social' },
    { id: 'business', name: 'Business', icon: 'briefcase' },
    { id: 'marketing', name: 'Marketing', icon: 'megaphone' },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || project.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      paddingTop: height * 0.05,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    searchContainer: {
      marginBottom: 16,
    },
    searchInput: {
      backgroundColor: colors.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      fontSize: 14,
    },
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 12,
      fontWeight: '500',
    },
    filterTextActive: {
      color: 'white',
    },
    filterTextInactive: {
      color: colors.textSecondary,
    },
    projectsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
      gap: 12,
    },
    projectCard: {
      width: (width - 44) / 2,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 120,
      justifyContent: 'center',
      alignItems: 'center',
    },
    projectThumbnail: {
      fontSize: 36,
      textAlign: 'center',
      marginBottom: 8,
    },
    projectName: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    projectDate: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: 40,
    },
    emptyIcon: {
      fontSize: 56,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Projects</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Ionicons
                name={filter.icon as any}
                size={14}
                color={selectedFilter === filter.id ? 'white' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id
                    ? styles.filterTextActive
                    : styles.filterTextInactive,
                ]}
              >
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredProjects.length > 0 ? (
        <View style={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <TouchableOpacity key={project.id} style={styles.projectCard}>
              <Text style={styles.projectThumbnail}>{project.thumbnail}</Text>
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectDate}>{project.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📁</Text>
          <Text style={styles.emptyTitle}>No projects found</Text>
          <Text style={styles.emptyText}>
            {searchQuery || selectedFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start creating your first design to see it here'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
} 