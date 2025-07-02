import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDesignStore } from '../stores/designStore';

interface CardProps {
  item: any;
  isAddButton?: boolean;
}

export default function Card({ item, isAddButton = false }: CardProps) {
  const router = useRouter();
  const { clearDesign } = useDesignStore();

  const handleAddDesign = () => {
    // Clear any existing design to start fresh
    clearDesign();
    router.push('CanvaDesignPage' as any);
  };

  if (isAddButton) {
    return (
      <TouchableOpacity style={styles.card} onPress={handleAddDesign}>
        <View style={styles.addButtonImage}>
          <Ionicons name="add" size={32} color="#FFB6E6" />
        </View>
        <Text style={styles.label}>Add Design</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    width: 120, 
    marginRight: 12, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 90 },
  addButtonImage: { 
    width: '100%', 
    height: 90, 
    backgroundColor: '#F8F8F8', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB6E6',
    borderStyle: 'dashed',
  },
  label: { padding: 8, fontSize: 14, color: '#333' }
});