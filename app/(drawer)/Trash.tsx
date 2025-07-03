import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function Trash() {
  return (
    <View style={styles.container}>
      <Ionicons name="trash" size={48} color="#6366F1" style={{ marginBottom: 16 }} />
      <Text style={styles.title}>Trash</Text>
      <Text style={styles.subtitle}>All deleted templates will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
}); 