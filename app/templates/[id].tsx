import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function TemplatesScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock category data
  const category = {
    id: id,
    name: 'Social Media',
    description: 'Posts, stories, and ads for social platforms',
    icon: '📱',
  };

  // Mock templates data
  const templates = [
    { id: 1, name: 'Instagram Post', thumbnail: '📱', dimensions: '1080 × 1080', downloads: 1234 },
    { id: 2, name: 'Facebook Cover', thumbnail: '📘', dimensions: '1200 × 630', downloads: 856 },
    { id: 3, name: 'Twitter Post', thumbnail: '🐦', dimensions: '1200 × 675', downloads: 567 },
    { id: 4, name: 'LinkedIn Post', thumbnail: '💼', dimensions: '1200 × 627', downloads: 432 },
    { id: 5, name: 'Instagram Story', thumbnail: '📱', dimensions: '1080 × 1920', downloads: 2341 },
    { id: 6, name: 'YouTube Thumbnail', thumbnail: '📺', dimensions: '1280 × 720', downloads: 789 },
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      paddingTop: 40,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    backButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    categoryInfo: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryIcon: {
      fontSize: 48,
      marginBottom: 10,
    },
    categoryName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    categoryDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    searchContainer: {
      marginBottom: 20,
    },
    searchInput: {
      backgroundColor: colors.surface,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 10,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    templatesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 15,
    },
    templateCard: {
      width: (width - 50) / 2,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    templateThumbnail: {
      fontSize: 40,
      textAlign: 'center',
      marginBottom: 10,
    },
    templateName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 5,
    },
    templateDimensions: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 5,
    },
    templateDownloads: {
      fontSize: 11,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '500',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  const handleTemplateSelect = (template: any) => {
    console.log(`Selected template: ${template.name}`);
    // Navigate to editor with template ID
    router.push('/editor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Templates</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {filteredTemplates.length > 0 ? (
          <View style={styles.templatesGrid}>
            {filteredTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateCard}
                onPress={() => handleTemplateSelect(template)}
              >
                <Text style={styles.templateThumbnail}>{template.thumbnail}</Text>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDimensions}>{template.dimensions}</Text>
                <Text style={styles.templateDownloads}>{template.downloads} downloads</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No templates found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No templates available for this category'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 