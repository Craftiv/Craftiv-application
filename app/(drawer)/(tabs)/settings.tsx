import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          title: 'Dark Mode',
          subtitle: 'Switch between light and dark themes',
          type: 'toggle',
          value: isDark,
          onValueChange: toggleTheme,
          icon: 'moon',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          subtitle: 'Edit your profile information',
          type: 'link',
          icon: 'person',
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: 'Manage your subscription plan',
          type: 'link',
          icon: 'card',
        },
        {
          id: 'storage',
          title: 'Storage',
          subtitle: 'Manage your design storage',
          type: 'link',
          icon: 'cloud',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Manage notification settings',
          type: 'link',
          icon: 'notifications',
        },
        {
          id: 'autoSave',
          title: 'Auto Save',
          subtitle: 'Automatically save your work',
          type: 'toggle',
          value: true,
          icon: 'save',
        },
        {
          id: 'quality',
          title: 'Export Quality',
          subtitle: 'Set default export quality',
          type: 'link',
          icon: 'settings',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'link',
          icon: 'help-circle',
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Share your thoughts with us',
          type: 'link',
          icon: 'chatbubble',
        },
        {
          id: 'about',
          title: 'About Craftiv',
          subtitle: 'Version 1.0.0',
          type: 'link',
          icon: 'information-circle',
        },
      ],
    },
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
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
      paddingHorizontal: 20,
    },
    settingItem: {
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    settingAction: {
      marginLeft: 10,
    },
    profileSection: {
      backgroundColor: colors.surface,
      marginHorizontal: 20,
      marginBottom: 30,
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    profileName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 5,
    },
    profileEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 15,
    },
    editProfileButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
    editProfileText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  const renderSettingItem = (item: any) => {
    return (
      <View key={item.id} style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon as any} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.settingAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={item.value ? colors.primary : colors.textSecondary}
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your Craftiv experience</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
        <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push('/(drawer)/Profile')}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {settingsSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map(renderSettingItem)}
        </View>
      ))}
    </ScrollView>
  );
} 