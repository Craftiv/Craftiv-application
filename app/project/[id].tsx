import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

export default function ProjectDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  // Mock project data - in a real app, this would come from an API
  const project = {
    id: id,
    name: 'Social Media Post',
    thumbnail: '🎨',
    date: '2 hours ago',
    type: 'social',
    dimensions: '1080 × 1080',
    status: 'In Progress',
    description: 'A vibrant social media post for our brand campaign',
  };

  const actions = [
    { id: 'edit', title: 'Edit Design', icon: 'create', color: colors.primary },
    { id: 'duplicate', title: 'Duplicate', icon: 'copy', color: colors.secondary },
    { id: 'share', title: 'Share', icon: 'share', color: colors.accent },
    { id: 'export', title: 'Export', icon: 'download', color: colors.success },
    { id: 'delete', title: 'Delete', icon: 'trash', color: colors.error },
  ];

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
    projectPreview: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 30,
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    projectThumbnail: {
      fontSize: 80,
      marginBottom: 15,
    },
    projectName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    projectStatus: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      marginBottom: 10,
    },
    projectDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    infoSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '40',
    },
    infoRowLast: {
      borderBottomWidth: 0,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    actionsSection: {
      marginBottom: 20,
    },
    actionsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
    },
    actionButton: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    actionArrow: {
      marginLeft: 10,
    },
  });

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'edit':
        // Navigate to editor with project ID
        console.log('Navigating to editor for project:', project.id);
        router.push('/editor');
        break;
      case 'duplicate':
        console.log('Duplicate project');
        break;
      case 'share':
        console.log('Share project');
        break;
      case 'export':
        console.log('Export project');
        break;
      case 'delete':
        console.log('Delete project');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.projectPreview}>
          <Text style={styles.projectThumbnail}>{project.thumbnail}</Text>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.projectStatus}>{project.status}</Text>
          <Text style={styles.projectDescription}>{project.description}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Project Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{project.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dimensions</Text>
            <Text style={styles.infoValue}>{project.dimensions}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>{project.date}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text style={styles.infoValue}>#{project.id}</Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Actions</Text>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={() => handleAction(action.id)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={20} color={action.color} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </View>
              <View style={styles.actionArrow}>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 