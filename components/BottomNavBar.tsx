import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNavBar() {
  const router = useRouter();
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('/') }>
        <Ionicons name="home" size={24} color="#FF2290" />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('./explore') }>
        <Ionicons name="search" size={24} color="#333" />
        <Text>Explore</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('./projects') }>
        <Ionicons name="folder" size={24} color="#333" />
        <Text>Projects</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.push('./settings') }>
        <Ionicons name="settings" size={24} color="#333" />
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: { alignItems: 'center' }
});