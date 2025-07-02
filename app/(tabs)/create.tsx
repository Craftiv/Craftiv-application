import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CreateScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const categories = [
    {
      id: 'social',
      name: 'Social Media',
      icon: 'share-social',
      description: 'Posts, stories, and ads',
      templates: 24,
      color: '#6366F1',
    },
    {
      id: 'business',
      name: 'Business',
      icon: 'briefcase',
      description: 'Cards, logos, and presentations',
      templates: 18,
      color: '#8B5CF6',
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: 'megaphone',
      description: 'Flyers, banners, and ads',
      templates: 32,
      color: '#F59E0B',
    },
    {
      id: 'education',
      name: 'Education',
      icon: 'school',
      description: 'Infographics and presentations',
      templates: 15,
      color: '#10B981',
    },
    {
      id: 'personal',
      name: 'Personal',
      icon: 'person',
      description: 'Cards, invitations, and gifts',
      templates: 12,
      color: '#EF4444',
    },
    {
      id: 'custom',
      name: 'Custom Size',
      icon: 'resize',
      description: 'Create your own dimensions',
      templates: 0,
      color: '#6B7280',
    },
  ];

  const popularTemplates = [
    { id: 1, name: 'Instagram Post', thumbnail: '📱', category: 'social' },
    { id: 2, name: 'Business Card', thumbnail: '💼', category: 'business' },
    { id: 3, name: 'Facebook Cover', thumbnail: '📘', category: 'social' },
    { id: 4, name: 'Flyer', thumbnail: '📄', category: 'marketing' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 30,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
      paddingHorizontal: 20,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      gap: 15,
    },
    categoryCard: {
      width: (width - 50) / 2,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 5,
    },
    categoryDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      lineHeight: 16,
    },
    categoryTemplates: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: '500',
    },
    templatesContainer: {
      paddingHorizontal: 20,
    },
    templateCard: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    templateThumbnail: {
      fontSize: 32,
      marginRight: 15,
    },
    templateInfo: {
      flex: 1,
    },
    templateName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    templateCategory: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    quickStart: {
      backgroundColor: colors.primary,
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 30,
    },
    quickStartText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    quickStartSubtext: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Design</Text>
        <Text style={styles.subtitle}>Choose a category or start from scratch</Text>
      </View>

      <TouchableOpacity style={styles.quickStart} onPress={() => router.push('/editor')}>
        <Ionicons name="add-circle" size={32} color="white" />
        <Text style={styles.quickStartText}>Start from Scratch</Text>
        <Text style={styles.quickStartSubtext}>Create a blank canvas with custom dimensions</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={24} color="white" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <Text style={styles.categoryTemplates}>
                {category.templates > 0 ? `${category.templates} templates` : 'Custom size'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Templates</Text>
        <View style={styles.templatesContainer}>
          {popularTemplates.map((template) => (
            <TouchableOpacity key={template.id} style={styles.templateCard}>
              <Text style={styles.templateThumbnail}>{template.thumbnail}</Text>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateCategory}>{template.category}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 