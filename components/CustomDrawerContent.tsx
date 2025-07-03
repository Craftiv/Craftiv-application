import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.bigSpacer} />
      <Text style={styles.title}>Menu</Text>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.item} onPress={() => router.push('/')}>
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.item} onPress={() => router.push('/Profile')}>
        <Text style={styles.label}>My Profile</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  bigSpacer: { height: 80 },
  title: { fontWeight: 'bold', fontSize: 22, marginLeft: 16, marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 2 },
  item: { paddingVertical: 16, paddingHorizontal: 16 },
  label: { fontSize: 16, color: '#111' },
}); 