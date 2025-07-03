import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: '#6366F1',
          tabBarInactiveTintColor: '#333333',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Montserrat_400Regular',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="folder" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={fabStyles.fab}
        onPress={() => router.push('/(drawer)/CreateScreen')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 120,
    backgroundColor: '#6366F1',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});