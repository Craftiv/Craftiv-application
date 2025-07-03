import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const actions = [
  { icon: <MaterialIcons name="insert-drive-file" size={28} color="#4285F4" />, label: 'Sheets' },
  { icon: <MaterialIcons name="slideshow" size={28} color="#34A853" />, label: 'Presentation' },
  { icon: <MaterialCommunityIcons name="file-document-edit" size={28} color="#FBBC05" />, label: 'Doc' },
  { icon: <MaterialIcons name="web" size={28} color="#EA4335" />, label: 'Website' },
];

export default function QuickActions() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {actions.map((action, idx) => (
        <TouchableOpacity key={idx} style={styles.action}>
          {action.icon}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 10, paddingLeft: 10 },
  action: { backgroundColor: '#fff', borderRadius: 20, padding: 12, marginRight: 16, elevation: 2 }
});