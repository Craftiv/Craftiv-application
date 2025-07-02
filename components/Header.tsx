import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Header() {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('Search Error', 'Please enter a search term');
      return;
    }

    setIsSearching(true);
    try {
      // Using JSONPlaceholder API for testing
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?title_like=${encodeURIComponent(searchText)}`);
      const data = await response.json();
      
      console.log('Search results:', data);
      Alert.alert(
        'Search Results', 
        `Found ${data.length} results for "${searchText}"\n\nFirst result: ${data[0]?.title || 'No results'}`
      );
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to perform search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <LinearGradient colors={['#a5b4fc', '#eef2ff','#FFFFFF',]}
      locations={[0, 0.4, 1]}
      style={styles.header}>
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.box} 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.box}
          onPress={() => router.push('/Profile')}
        >
          <Ionicons name="person-circle" size={30} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>What will you design today?</Text>
      <View style={styles.searchRow}>
        <TouchableOpacity 
          style={styles.tabBtn}
          onPress={() => router.push('/YourStories')}
        >
          <Ionicons name="color-palette" size={18} color="black" />
          <Text>Your Designs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabBtn}>
          <Ionicons name="grid" size={18} color="black" />
          <Text>Templates</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.search}
          placeholder="Search your content"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} disabled={isSearching}>
          <View style={[styles.ArrowForward, isSearching && styles.searching]}>
            <Ionicons 
              name={isSearching ? "hourglass" : "arrow-forward"} 
              size={20} 
              color="black" 
            />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { padding: 10, paddingTop: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16, color: '#000000', fontFamily: 'Montserrat_700Bold', textAlign: 'center' },
  searchRow: { flexDirection: 'row', marginBottom: 8 },
  tabBtn: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 8, marginRight: 8, fontFamily: 'Montserrat_700Regular', borderWidth: 1, borderColor: '#ddd' },
  search: { flex: 1, fontSize: 14 },
  box: { width: 40, height: 40, backgroundColor: '#FFFFFF', borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: '#ddd',
    borderWidth: 1
  },
  ArrowForward: { width: 35, height: 35, backgroundColor: '#EAE9E9', borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  searching: { backgroundColor: '#FFE4E1' },
});