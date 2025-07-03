import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const shapes = [
  { type: 'rectangle', icon: <MaterialCommunityIcons name="rectangle-outline" size={28} color="#6366F1" /> },
  { type: 'circle', icon: <MaterialCommunityIcons name="circle-outline" size={28} color="#6366F1" /> },
  { type: 'ellipse', icon: <MaterialCommunityIcons name="ellipse-outline" size={28} color="#6366F1" /> },
  { type: 'triangle', icon: <MaterialCommunityIcons name="triangle-outline" size={28} color="#6366F1" /> },
  { type: 'line', icon: <MaterialCommunityIcons name="minus" size={28} color="#6366F1" /> },
  { type: 'star', icon: <MaterialCommunityIcons name="star-outline" size={28} color="#6366F1" /> },
];

export default function ShapePicker({ selected, onSelect }: { selected: string; onSelect: (type: string) => void }) {
  return (
    <View style={styles.row}>
      {shapes.map((shape) => (
        <TouchableOpacity
          key={shape.type}
          style={[styles.btn, selected === shape.type && styles.selected]}
          onPress={() => onSelect(shape.type)}
        >
          {shape.icon}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 8, backgroundColor: '#F3F4F6', borderRadius: 16, marginVertical: 8, alignSelf: 'center' },
  btn: { marginHorizontal: 6, padding: 6, borderRadius: 8 },
  selected: { backgroundColor: '#6366F1', },
}); 