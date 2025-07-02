import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

import { useDesigns } from '../../contexts/DesignContext';
import { useDesignStore } from '../../stores/designStore';

export default function YourStories() {
  const { recentDesigns, deleteDesign } = useDesigns();
  const { loadDesignById } = useDesignStore();
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const router = useRouter();

  const handleDesignPress = async (designId: string) => {
    try {
      // Load the specific design into the store
      const success = await loadDesignById(designId);
      if (success) {
        setSelectedDesign(designId);
        // Navigate to the design page
        router.push('/CanvaDesignPage' as any);
      } else {
        Alert.alert('Error', 'Failed to load design');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load design');
    }
  };

  const handleDownload = async (design: any) => {
    try {
      if (!viewShotRef.current || typeof viewShotRef.current.capture !== 'function') {
        Alert.alert('Error', 'Cannot capture design');
        return;
      }

      // Capture the design as an image
      const uri = await viewShotRef.current.capture();
      
      // Create a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `design-${design.id}-${timestamp}.png`;
      
      // Save to app's document directory
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri
      });
      
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: `Share ${design.label}`,
        });
        Alert.alert('Success', 'Design shared successfully!');
      } else {
        Alert.alert('Success', `Design saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download design');
    }
  };

  const handleDelete = (designId: string) => {
    Alert.alert(
      'Delete Design',
      'Are you sure you want to delete this design?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteDesign(designId);
            Alert.alert('Success', 'Design deleted successfully');
          },
        },
      ]
    );
  };

  const renderDesignItem = ({ item }: { item: any }) => (
    <View style={styles.designCard}>
      <TouchableOpacity
        style={styles.designImage}
        onPress={() => handleDesignPress(item.id)}
      >
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>{item.label}</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.designInfo}>
        <Text style={styles.designTitle} numberOfLines={1}>
          {item.label}
        </Text>
        <Text style={styles.designDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDownload(item)}
        >
          <Ionicons name="download" size={20} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Your Stories</Text>
          <Text style={styles.headerSubtitle}>
            {recentDesigns.length} design{recentDesigns.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Designs List */}
      {recentDesigns.length > 0 ? (
        <FlatList
          data={recentDesigns}
          renderItem={renderDesignItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>No designs yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first design to see it here
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/CanvaDesignPage' as any)}
          >
            <Text style={styles.createButtonText}>Create Design</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hidden ViewShot for capturing designs */}
      <ViewShot ref={viewShotRef} style={styles.hiddenView}>
        <View style={styles.captureView}>
          {/* This will be used to capture designs */}
        </View>
      </ViewShot>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  designCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  designImage: {
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  designInfo: {
    marginBottom: 12,
  },
  designTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  designDate: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F8F8F8',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  hiddenView: {
    position: 'absolute',
    top: -1000,
    left: -1000,
  },
  captureView: {
    width: 300,
    height: 200,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: 'column',
    marginLeft: 16,
  },
  createButton: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 