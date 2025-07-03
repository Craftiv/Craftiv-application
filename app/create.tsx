import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CreatePage() {
  const { colors } = useTheme();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const presetSizes = [
    { name: 'Instagram Post', width: 1080, height: 1080, icon: '📱' },
    { name: 'Instagram Story', width: 1080, height: 1920, icon: '📱' },
    { name: 'Facebook Post', width: 1200, height: 630, icon: '📘' },
    { name: 'Twitter Post', width: 1200, height: 675, icon: '🐦' },
    { name: 'LinkedIn Post', width: 1200, height: 627, icon: '💼' },
    { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: '📺' },
    { name: 'Business Card', width: 1050, height: 600, icon: '💼' },
    { name: 'A4 Document', width: 2480, height: 3508, icon: '📄' },
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
    closeButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 15,
    },
    sizesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 15,
    },
    sizeCard: {
      width: (width - 50) / 2,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 15,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    sizeIcon: {
      fontSize: 32,
      marginBottom: 10,
    },
    sizeName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 5,
    },
    sizeDimensions: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    customButton: {
      backgroundColor: colors.primary,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    customButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      width: width - 40,
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 15,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 5,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      fontSize: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.border,
    },
    createButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    cancelButtonText: {
      color: colors.text,
    },
    createButtonText: {
      color: 'white',
    },
  });

  const handleCreateDesign = (width: number, height: number, name?: string) => {
    // Navigate to editor with design parameters
    console.log(`Creating design: ${width}x${height} ${name || ''}`);
    router.push('/editor');
  };

  const handleCustomCreate = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    
    if (width > 0 && height > 0) {
      handleCreateDesign(width, height, 'Custom Design');
      setShowCustomModal(false);
      setCustomWidth('');
      setCustomHeight('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Design</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Size</Text>
          <View style={styles.sizesGrid}>
            {presetSizes.map((size) => (
              <TouchableOpacity
                key={size.name}
                style={styles.sizeCard}
                onPress={() => handleCreateDesign(size.width, size.height, size.name)}
              >
                <Text style={styles.sizeIcon}>{size.icon}</Text>
                <Text style={styles.sizeName}>{size.name}</Text>
                <Text style={styles.sizeDimensions}>{size.width} × {size.height}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.customButton}
          onPress={() => setShowCustomModal(true)}
        >
          <Ionicons name="resize" size={24} color="white" />
          <Text style={styles.customButtonText}>Custom Size</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Custom Size</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Width (px)</Text>
              <TextInput
                style={styles.input}
                value={customWidth}
                onChangeText={setCustomWidth}
                placeholder="Enter width"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (px)</Text>
              <TextInput
                style={styles.input}
                value={customHeight}
                onChangeText={setCustomHeight}
                placeholder="Enter height"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCustomCreate}
              >
                <Text style={[styles.buttonText, styles.createButtonText]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 