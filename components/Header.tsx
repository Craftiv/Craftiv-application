import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { colors, isDark } = useTheme();
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
    <LinearGradient
      colors={isDark ? ['#23235B', '#18191B'] : ['#a5b4fc', '#eef2ff', '#FFFFFF']}
      style={[styles.header, { backgroundColor: isDark ? '#18191B' : '#FFFFFF' }]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.menuBtn, { backgroundColor: isDark ? '#18191B' : '#fff' }]}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={28} color={isDark ? '#6366F1' : '#333'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.profileBtn, { backgroundColor: isDark ? '#18191B' : '#fff' }]}
          onPress={() => router.push('/(drawer)/Profile')}
        >
          <Ionicons name="person-circle" size={32} color={isDark ? '#6366F1' : '#333'} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: isDark ? '#fff' : colors.text }]}>What will you design today?</Text>
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
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBtn: {
    padding: 4,
    borderRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileBtn: {
    padding: 4,
    borderRadius: 6,
  },
  searchRow: { flexDirection: 'row', marginBottom: 8 },
  tabBtn: { display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 8, borderRadius: 8, marginRight: 8, fontFamily: 'Montserrat_700Regular', borderWidth: 1, borderColor: '#ddd' },
  search: { flex: 1, fontSize: 14 },
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