// This file is moved from (tabs) to (drawer) to be used as a modal/stack screen. 

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="What would you love to create?"
          placeholderTextColor="#888"
        />
        <TouchableOpacity>
          <Ionicons name="close" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
        <TouchableOpacity style={styles.tab}><MaterialIcons name="star" size={18} color="#6366F1" /><Text style={styles.tabText}>For you</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><MaterialIcons name="people" size={18} color="#EF4444" /><Text style={styles.tabText}>Social media</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><MaterialIcons name="ondemand-video" size={18} color="#A21CAF" /><Text style={styles.tabText}>Videos</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><MaterialIcons name="photo" size={18} color="#EC4899" /><Text style={styles.tabText}>Photos</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><MaterialIcons name="aspect-ratio" size={18} color="#6366F1" /><Text style={styles.tabText}>Custom size</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><MaterialIcons name="cloud-upload" size={18} color="#6366F1" /><Text style={styles.tabText}>Upload</Text></TouchableOpacity>
      </ScrollView>

      {/* Create new */}
      <Text style={styles.sectionTitle}>Create new</Text>
      <View style={styles.createNewRow}>
        {[1,2,3].map((_,i) => (
          <View key={i} style={styles.createNewCard}>
            <Image source={require('../../assets/images/project.jpg')} style={styles.createNewImage} />
          </View>
        ))}
      </View>

      {/* Templates for you */}
      <View style={styles.templatesHeader}>
        <Text style={styles.sectionTitle}>Templates for you</Text>
        <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
      </View>
      <View style={styles.templatesRow}>
        <Image source={require('../../assets/images/project.jpg')} style={styles.templateImage} />
        <Image source={require('../../assets/images/project.jpg')} style={styles.templateImage} />
      </View>

      {/* Start creating button */}
      <TouchableOpacity style={styles.startCreatingBtn} onPress={() => router.push('/(drawer)/CanvaDesignPage')}>
        <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.startCreatingText}>Start creating</Text>
      </TouchableOpacity>

      {/* Create using your photos and videos */}
      <Text style={styles.sectionTitle}>Create using your photos and videos</Text>
      <View style={styles.photosRow}>
        {[1,2,3,4].map((_,i) => (
          <View key={i} style={styles.photoCard}>
            <Image source={require('../../assets/images/project.jpg')} style={styles.photoImage} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 10, marginTop: 16, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#222' },
  tabsRow: { flexDirection: 'row', marginBottom: 10 },
  tab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  tabText: { marginLeft: 4, fontSize: 14, color: '#222' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  createNewRow: { flexDirection: 'row', marginBottom: 10 },
  createNewCard: { flex: 1, marginRight: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  createNewImage: { width: '100%', height: 80, resizeMode: 'cover' },
  templatesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  seeAll: { color: '#6366F1', fontWeight: 'bold' },
  templatesRow: { flexDirection: 'row', marginBottom: 10 },
  templateImage: { flex: 1, height: 120, borderRadius: 12, marginRight: 8 },
  startCreatingBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6366F1', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-end', marginBottom: 16 },
  startCreatingText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  photosRow: { flexDirection: 'row', marginBottom: 20 },
  photoCard: { flex: 1, marginRight: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  photoImage: { width: '100%', height: 60, resizeMode: 'cover' },
}); 