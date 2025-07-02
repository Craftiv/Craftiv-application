import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const recentDesigns = [
  { id: '1', label: 'Untitled Design', image: 'https://placehold.co/120x90/FFB6E6/fff?text=Design' },
  { id: '2', label: 'Untitled Design', image: 'https://placehold.co/120x90/FFB6E6/fff?text=Design' },
  { id: '3', label: 'Untitled Design', image: 'https://placehold.co/120x90/FFB6E6/fff?text=Design' },
];
const designs = [
  { id: '1', label: 'Whiteboard', image: 'https://placehold.co/120x90/fff/000?text=Whiteboard' },
  { id: '2', label: 'Whiteboard', image: 'https://placehold.co/120x90/fff/000?text=Whiteboard' },
];

export default function ProjectsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header with background image */}
      <View style={styles.headerImgContainer}>
        <Image source={require('../../../assets/images/project.jpg')} style={styles.headerImg} />
        <View style={styles.headerOverlay} />
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projects</Text>
      </View>
      {/* Filters */}
      <View style={styles.filtersRow}>
        <TouchableOpacity style={styles.filterBtn}><Text>Owner ▼</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}><Text>Category ▼</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}><Text>Date modified ▼</Text></TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabActive}><Text>All</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><Text>Folders</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><Text>Designs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><Text>Images</Text></TouchableOpacity>
      </View>
      {/* Recent Designs */}
      <Text style={styles.sectionTitle}>Recent designs</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
        {recentDesigns.map(item => (
          <View key={item.id} style={styles.designCard}>
            <Image source={{ uri: item.image }} style={styles.designImg} />
            <Text style={styles.designLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
      {/* Folders */}
      <Text style={styles.sectionTitle}>Folders</Text>
      <View style={styles.folderRow}>
        <Ionicons name="folder" size={32} color="#888" />
        <Text style={{ marginLeft: 8 }}>Uploads</Text>
      </View>
      {/* Designs */}
      <Text style={styles.sectionTitle}>Designs</Text>
      <View style={styles.designsGrid}>
        {designs.map(item => (
          <View key={item.id} style={styles.gridCard}>
            <Image source={{ uri: item.image }} style={styles.gridImg} />
            <Text style={styles.gridLabel}>{item.label}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImgContainer: { height: 120, marginBottom: 12, justifyContent: 'center' },
  headerImg: { width: '100%', height: '100%', position: 'absolute', borderRadius: 0 },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  menuBtn: { position: 'absolute', top: 10, left: 10, zIndex: 2 },
  headerTitle: { position: 'absolute', left: 50, top: 10, color: '#fff', fontSize: 22, fontWeight: 'bold', zIndex: 2 },
  filtersRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 8 },
  filterBtn: { backgroundColor: '#eee', padding: 6, borderRadius: 6, marginRight: 6 },
  tabsRow: { flexDirection: 'row', marginHorizontal: 10, marginBottom: 8 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#eee', marginRight: 6 },
  tabActive: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF2290', marginRight: 6 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginHorizontal: 10, marginTop: 16, marginBottom: 8 },
  horizontalList: { paddingLeft: 10 },
  designCard: { width: 100, marginRight: 10, alignItems: 'center' },
  designImg: { width: 90, height: 70, borderRadius: 8, marginBottom: 4 },
  designLabel: { fontSize: 12 },
  folderRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 8 },
  designsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10, marginTop: 8 },
  gridCard: { width: 100, marginRight: 10, marginBottom: 10, alignItems: 'center' },
  gridImg: { width: 90, height: 70, borderRadius: 8, marginBottom: 4 },
  gridLabel: { fontSize: 12 },
  addBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FF2290', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0, bottom: 0, zIndex: 2 },
}); 