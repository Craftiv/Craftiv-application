import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, ListRenderItem, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Define a type for a doc template
interface DocTemplate {
  id: string;
  text: string;
  color: string;
  fontFamily: string;
  isBold: boolean;
}

export default function DocsEditor() {
  const [text, setText] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('#222');
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [templates, setTemplates] = useState<DocTemplate[]>([]); // For gallery

  // Load templates from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('docsTemplates');
      if (stored) setTemplates(JSON.parse(stored));
    })();
  }, []);

  // Dummy undo/redo (for demo)
  const undo = () => {};
  const redo = () => {};

  // Save as template and persist
  const saveAsTemplate = async () => {
    const newTemplates = [
      { id: Date.now().toString(), text, color, fontFamily, isBold },
      ...templates
    ];
    setTemplates(newTemplates);
    await AsyncStorage.setItem('docsTemplates', JSON.stringify(newTemplates));
  };

  // Render template cards
  const renderTemplate: ListRenderItem<DocTemplate> = ({ item }) => (
    <View style={styles.templateCard}>
      <Text style={{ color: item.color, fontFamily: item.fontFamily, fontWeight: item.isBold ? 'bold' : 'normal' }} numberOfLines={3}>{item.text || 'Empty Doc'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Toolbar */}
      <View style={styles.topToolbar}>
        <TouchableOpacity onPress={undo}><Ionicons name="arrow-undo" size={24} color="#333" /></TouchableOpacity>
        <TouchableOpacity onPress={redo}><Ionicons name="arrow-redo" size={24} color="#333" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={24} color="#333" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="save" size={24} color="#333" /></TouchableOpacity>
        <TouchableOpacity onPress={saveAsTemplate} style={styles.saveTemplateBtn}>
          <Ionicons name="star" size={20} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 4 }}>Save as Template</Text>
        </TouchableOpacity>
      </View>

      {/* Rich Text Area */}
      <ScrollView style={styles.editorArea}>
        <TextInput
          style={[
            styles.textInput,
            { color, fontFamily, fontWeight: isBold ? 'bold' : 'normal' }
          ]}
          multiline
          placeholder="Write what should not be forgotten.\n- Isabel Allende"
          value={text}
          onChangeText={setText}
        />
      </ScrollView>

      {/* Bottom Formatting Toolbar */}
      <View style={styles.bottomToolbar}>
        <TouchableOpacity onPress={() => setIsBold(b => !b)}>
          <Text style={[styles.toolbarBtn, isBold && { fontWeight: 'bold', color: '#6366F1' }]}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowColorPicker(true)}>
          <MaterialIcons name="format-color-text" size={24} color={color} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowFontPicker(true)}>
          <MaterialIcons name="font-download" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <Modal visible={showColorPicker} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.pickerModal}>
            {['#222', '#6366F1', '#EC4899', '#1B8C5A', '#C23A7A', '#F59E42'].map(c => (
              <TouchableOpacity key={c} style={[styles.colorSwatch, { backgroundColor: c }]} onPress={() => { setColor(c); setShowColorPicker(false); }} />
            ))}
            <TouchableOpacity onPress={() => setShowColorPicker(false)}><Text style={styles.closeBtn}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Font Picker Modal */}
      <Modal visible={showFontPicker} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.pickerModal}>
            {['sans-serif', 'serif', 'monospace', 'cursive'].map(f => (
              <TouchableOpacity key={f} style={styles.fontOption} onPress={() => { setFontFamily(f); setShowFontPicker(false); }}>
                <Text style={{ fontFamily: f }}>{f}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowFontPicker(false)}><Text style={styles.closeBtn}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Docs Templates Gallery */}
      <Text style={styles.templatesTitle}>Docs Templates</Text>
      <FlatList
        data={templates}
        renderItem={renderTemplate}
        keyExtractor={item => item.id}
        horizontal
        style={styles.templatesList}
        ListEmptyComponent={<Text style={styles.emptyText}>No templates yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 32 },
  topToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 8 },
  saveTemplateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 4 },
  editorArea: { flex: 1, paddingHorizontal: 16 },
  textInput: { minHeight: 120, fontSize: 18, marginTop: 16 },
  bottomToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 12, borderTopWidth: 1, borderColor: '#eee' },
  toolbarBtn: { fontSize: 20, marginRight: 16 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  pickerModal: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center' },
  colorSwatch: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 6, borderWidth: 2, borderColor: '#eee' },
  fontOption: { marginHorizontal: 8 },
  closeBtn: { color: '#6366F1', fontWeight: 'bold', marginLeft: 12 },
  templatesTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginLeft: 16 },
  templatesList: { minHeight: 80, marginVertical: 8 },
  templateCard: { width: 120, height: 80, backgroundColor: '#F3F4F6', borderRadius: 12, marginHorizontal: 8, padding: 8, justifyContent: 'center' },
  emptyText: { color: '#aaa', marginLeft: 16 },
}); 