import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const EditorScreen: React.FC = () => {
  const { colors } = useTheme();
  const { templateId, projectId } = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState<'Text' | 'Images' | 'Shapes' | 'Background'>('Text');
  const [canvasItems, setCanvasItems] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [itemIdCounter, setItemIdCounter] = useState(0);

  const handleAddText = () => {
    if (!selectedText.trim()) return;
    setCanvasItems((prev) => [
      ...prev,
      { id: itemIdCounter, text: selectedText, x: 50, y: 50 },
    ]);
    setItemIdCounter((prev) => prev + 1);
    setSelectedText('');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: height * 0.05,
    },
    title: {
      fontWeight: '600',
      fontSize: 16,
      color: colors.text,
    },
    backButton: {
      padding: 8,
    },
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabText: {
      fontSize: 14,
      color: colors.textSecondary,
      paddingBottom: 4,
      fontWeight: '500',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
      color: colors.primary,
    },
    canvas: {
      flex: 1,
      margin: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      position: 'relative',
    },
    toolbar: {
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    icon: {
      marginRight: 16,
      color: colors.textSecondary,
    },
    textInputBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 8,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
    },
    addButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    opacityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      justifyContent: 'space-between',
    },
    opacityLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    sliderTrack: {
      flex: 1,
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginHorizontal: 12,
    },
    sliderFill: {
      width: '60%',
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {templateId ? `Template ${templateId}` : projectId ? `Project ${projectId}` : 'Untitled Design'}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['Text', 'Images', 'Shapes', 'Background'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
            <Text
              style={[styles.tabText, activeTab === tab ? styles.activeTab : undefined]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Canvas Area */}
      <View style={styles.canvas}>
        {canvasItems.map((item) => (
          <View
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              backgroundColor: 'transparent',
            }}
          >
            <Text style={{ fontSize: 18, color: colors.text }}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Text Input (Active on Text tab) */}
      {activeTab === 'Text' && (
        <View style={styles.textInputBar}>
          <TextInput
            placeholder="Enter text"
            placeholderTextColor={colors.textSecondary}
            value={selectedText}
            onChangeText={setSelectedText}
            style={styles.textInput}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddText}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity>
            <Ionicons name="text" size={20} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="remove" size={20} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="resize" size={20} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="color-palette" size={20} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="options" size={20} style={styles.icon} />
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.opacityRow}>
          <Text style={styles.opacityLabel}>Opacity</Text>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderFill} />
          </View>
          <TouchableOpacity>
            <Ionicons name="checkmark" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditorScreen; 