import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextElement, useDesignStore } from '../stores/designStore';
import ColorPicker from './ColorPicker';

interface TextEditorProps {
  visible: boolean;
  onClose: () => void;
  textElementId: string | null;
}

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];
const FONT_FAMILIES = ['System', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia'];

export default function TextEditor({ visible, onClose, textElementId }: TextEditorProps) {
  const { elements, updateElement } = useDesignStore();
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('System');
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Find the text element being edited
  const textElement = elements.find(el => el.id === textElementId) as TextElement | undefined;

  useEffect(() => {
    if (textElement) {
      setText(textElement.text);
      setFontSize(textElement.fontSize);
      setFontFamily(textElement.fontFamily);
      setColor(textElement.color);
    }
  }, [textElement]);

  const handleSave = () => {
    if (!textElement) return;

    if (!text.trim()) {
      Alert.alert('Error', 'Text cannot be empty');
      return;
    }

    updateElement(textElementId!, {
      text: text.trim(),
      fontSize,
      fontFamily,
      color,
    });

    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    if (textElement) {
      setText(textElement.text);
      setFontSize(textElement.fontSize);
      setFontFamily(textElement.fontFamily);
      setColor(textElement.color);
    }
    onClose();
  };

  const FontSizeButton = ({ size }: { size: number }) => (
    <TouchableOpacity
      style={[styles.fontSizeButton, fontSize === size && styles.selectedFontSizeButton]}
      onPress={() => setFontSize(size)}
    >
      <Text style={[styles.fontSizeText, fontSize === size && styles.selectedFontSizeText]}>
        {size}
      </Text>
    </TouchableOpacity>
  );

  const FontFamilyButton = ({ family }: { family: string }) => (
    <TouchableOpacity
      style={[styles.fontFamilyButton, fontFamily === family && styles.selectedFontFamilyButton]}
      onPress={() => setFontFamily(family)}
    >
      <Text style={[styles.fontFamilyText, fontFamily === family && styles.selectedFontFamilyText]}>
        {family}
      </Text>
    </TouchableOpacity>
  );

  if (!textElement) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Edit Text</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Text Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Text Content</Text>
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={setText}
                  placeholder="Enter your text here..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Font Size */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Font Size</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontSizeContainer}>
                  {FONT_SIZES.map((size) => (
                    <FontSizeButton key={size} size={size} />
                  ))}
                </ScrollView>
              </View>

              {/* Font Family */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Font Family</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontFamilyContainer}>
                  {FONT_FAMILIES.map((family) => (
                    <FontFamilyButton key={family} family={family} />
                  ))}
                </ScrollView>
              </View>

              {/* Color */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Text Color</Text>
                <TouchableOpacity
                  style={styles.colorButton}
                  onPress={() => setShowColorPicker(true)}
                >
                  <View style={[styles.colorPreview, { backgroundColor: color }]} />
                  <Text style={styles.colorText}>{color}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Preview */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preview</Text>
                <View style={styles.previewContainer}>
                  <Text
                    style={[
                      styles.previewText,
                      {
                        fontSize,
                        fontFamily,
                        color,
                      },
                    ]}
                  >
                    {text || 'Preview text will appear here...'}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <ColorPicker
          visible={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          onColorSelect={(selectedColor) => {
            setColor(selectedColor);
            setShowColorPicker(false);
          }}
          initialColor={color}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  fontSizeContainer: {
    flexDirection: 'row',
  },
  fontSizeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  selectedFontSizeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  fontSizeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFontSizeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fontFamilyContainer: {
    flexDirection: 'row',
  },
  fontFamilyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  selectedFontFamilyButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  fontFamilyText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFontFamilyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  colorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  colorText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  previewContainer: {
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    minHeight: 80,
    justifyContent: 'center',
  },
  previewText: {
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 