import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { isDark, colors } = useTheme();

  // Define gradients and text/icon colors for each mode
  const gradientColors = isDark
    ? (['rgba(24,25,27,0.95)', 'rgba(99,102,241,0.25)', 'rgba(24,25,27,0.85)'] as [string, string, ...string[]])
    : (['rgba(99,102,241,0.50)', 'rgba(215, 161, 161, 0.15)', 'rgba(59,44,51,0.1)'] as [string, string, ...string[]]);
  const fontColor = isDark ? '#F1F5F9' : '#1E293B';
  const iconColor = isDark ? '#F1F5F9' : '#6366F1';
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99,102,241,0.10)';

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.bigSpacer} />
        <Text style={[styles.title, { color: fontColor }]}>Menu</Text>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <TouchableOpacity style={styles.item} onPress={() => router.push('/')}>
          <Text style={[styles.label, { color: fontColor }]}>Home</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(drawer)/(tabs)/projects')}>
          <Ionicons name="folder" size={22} style={[styles.icon, { color: iconColor }]} />
          <Text style={[styles.label, { color: fontColor }]}>Projects</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <TouchableOpacity style={styles.item}>
          <Ionicons name="albums" size={22} style={[styles.icon, { color: iconColor }]} />
          <Text style={[styles.label, { color: fontColor }]}>Templates</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(drawer)/(tabs)/settings')}>
          <Ionicons name="settings" size={22} style={[styles.icon, { color: iconColor }]} />
          <Text style={[styles.label, { color: fontColor }]}>Settings</Text>
        </TouchableOpacity>
        <View style={[styles.divider, { backgroundColor: dividerColor }]} />
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(drawer)/Trash')}>
          <Ionicons name="trash" size={22} style={[styles.icon, { color: iconColor }]} />
          <Text style={[styles.label, { color: fontColor }]}>Trash</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  bigSpacer: { height: 80 },
  title: { fontWeight: 'bold', fontSize: 22, marginLeft: 16, marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 4 },
  divider: { height: 1, marginVertical: 2 },
  item: { paddingVertical: 16, paddingHorizontal: 16 },
  label: { fontSize: 16, textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  icon: {
    marginRight: 16,
    textShadowColor: 'rgba(99,102,241,0.4)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
}); 