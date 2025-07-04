import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Project {
  id: string;
  title: string;
  thumbnail: string;
  lastModified: string;
  collaborators: number;
  isAISuggested?: boolean;
  hasVoiceCommands?: boolean;
  is3DPreview?: boolean;
  category: string;
  isSmartTemplate?: boolean;
  hasLiveCollaboration?: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Summer Marketing Campaign',
    thumbnail: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Summer+Campaign',
    lastModified: '2 hours ago',
    collaborators: 3,
    isAISuggested: true,
    hasVoiceCommands: true,
    is3DPreview: true,
    category: 'Marketing',
    isSmartTemplate: true,
    hasLiveCollaboration: true,
  },
  {
    id: '2',
    title: 'Product Launch Presentation',
    thumbnail: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Product+Launch',
    lastModified: '1 day ago',
    collaborators: 5,
    is3DPreview: true,
    category: 'Business',
    hasLiveCollaboration: true,
  },
  {
    id: '3',
    title: 'Social Media Templates',
    thumbnail: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Social+Media',
    lastModified: '3 days ago',
    collaborators: 2,
    isAISuggested: true,
    category: 'Social Media',
    isSmartTemplate: true,
  },
  {
    id: '4',
    title: 'Event Invitation Cards',
    thumbnail: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Event+Cards',
    lastModified: '1 week ago',
    collaborators: 1,
    hasVoiceCommands: true,
    category: 'Events',
  },
  {
    id: '5',
    title: 'Brand Guidelines',
    thumbnail: 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=Brand+Guidelines',
    lastModified: '2 weeks ago',
    collaborators: 4,
    isAISuggested: true,
    is3DPreview: true,
    category: 'Branding',
    isSmartTemplate: true,
  },
  {
    id: '6',
    title: 'Infographic Design',
    thumbnail: 'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Infographic',
    lastModified: '3 weeks ago',
    collaborators: 2,
    hasVoiceCommands: true,
    category: 'Education',
  }
];

const mockCollaborators = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '',
    color: '#FF6B6B',
    isOnline: true,
    currentAction: 'Editing text',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: '',
    color: '#4ECDC4',
    isOnline: true,
    currentAction: 'Adding images',
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: '',
    color: '#45B7D1',
    isOnline: false,
  },
];

// Mock data for folders and images
const mockFolders = [
  { id: '1', name: 'Uploads' },
];
const mockImages = Array.from({ length: 3 }).map((_, i) => ({
  id: i.toString(),
  title: 'Image',
  thumbnail: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Image',
}));

export default function ProjectsScreen() {
  const { colors, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('All');
  const designs = mockProjects;

  // Owner dropdown state
  const [ownerDropdownVisible, setOwnerDropdownVisible] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('Any owner');
  const mockOwners = [
    { id: 'me', name: 'Personal user' },
    { id: 'any', name: 'Any owner' },
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Bob Smith' },
    { id: '3', name: 'Charlie Brown' },
  ];

  // Category dropdown state
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const mockCategories = [
    'Poster',
    'Snapchat Story',
    'Your Story',
    'Instagram Story',
    'Video',
    'Marketing',
    'Business',
    'Social Media',
    'Events',
    'Branding',
    'Education',
  ];

  // Date modified dropdown state
  const [dateDropdownVisible, setDateDropdownVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Any time');
  const mockDateOptions = [
    'Any time',
    'Today',
    'Yesterday',
    'This week',
    'This month',
    'This year',
  ];

  const handleCardPress = (item: any) => {
    alert(`You clicked on: ${item.title}`);
  };

  const handleUploadPress = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // or .All if you want videos too
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      // Do something with the selected file (e.g., upload to backend, show preview, etc.)
      alert('Selected file: ' + selectedAsset.uri);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with bird texture and large title */}
      <ImageBackground
        source={require('@/assets/images/projectimg.jpg')}
        style={[styles.headerBackground, { backgroundColor: colors.surface }]}
        imageStyle={{ opacity: 0.22 }}
        resizeMode="cover"
      >
        <ThemedText style={[styles.headerTitle, { color: colors.text }]}>Projects</ThemedText>
      </ImageBackground>
      {/* Filter Bar */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface }]}>
        {/* Owner Dropdown */}
        <View style={{ position: 'relative', flex: 1 }}>
          <TouchableOpacity
            style={styles.filterDropdown}
            onPress={() => setOwnerDropdownVisible(!ownerDropdownVisible)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.dropdownSelectedText}>{selectedOwner}</ThemedText>
            <MaterialIcons name="arrow-drop-down" size={18} />
          </TouchableOpacity>
          {ownerDropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TextInput
                style={styles.dropdownSearch}
                placeholder="Search people..."
                value={ownerSearch}
                onChangeText={setOwnerSearch}
                placeholderTextColor="#888"
              />
              {mockOwners
                .filter(owner =>
                  owner.name.toLowerCase().includes(ownerSearch.toLowerCase())
                )
                .map(owner => (
                  <TouchableOpacity
                    key={owner.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedOwner(owner.name);
                      setOwnerDropdownVisible(false);
                      setOwnerSearch('');
                    }}
                  >
                    <ThemedText style={styles.dropdownItemText}>{owner.name}</ThemedText>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
        {/* Category Dropdown */}
        <View style={{ position: 'relative', flex: 1 }}>
          <TouchableOpacity
            style={styles.filterDropdown}
            onPress={() => setCategoryDropdownVisible(!categoryDropdownVisible)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.dropdownSelectedText}>{selectedCategory}</ThemedText>
            <MaterialIcons name="arrow-drop-down" size={18} />
          </TouchableOpacity>
          {categoryDropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TextInput
                style={styles.dropdownSearch}
                placeholder="Search categories..."
                value={categorySearch}
                onChangeText={setCategorySearch}
                placeholderTextColor="#888"
              />
              {mockCategories
                .filter(cat =>
                  cat.toLowerCase().includes(categorySearch.toLowerCase())
                )
                .map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setCategoryDropdownVisible(false);
                      setCategorySearch('');
                    }}
                  >
                    <ThemedText style={styles.dropdownItemText}>{cat}</ThemedText>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
        {/* Date Modified Dropdown */}
        <View style={{ position: 'relative', flex: 1 }}>
          <TouchableOpacity
            style={styles.filterDropdown}
            onPress={() => setDateDropdownVisible(!dateDropdownVisible)}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.dropdownSelectedText}>{selectedDate}</ThemedText>
            <MaterialIcons name="arrow-drop-down" size={18} />
          </TouchableOpacity>
          {dateDropdownVisible && (
            <View style={styles.dropdownMenu}>
              {mockDateOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedDate(option);
                    setDateDropdownVisible(false);
                  }}
                >
                  <ThemedText style={styles.dropdownItemText}>{option}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['All', 'Folders', 'Designs', 'Images'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, selectedTab === tab && styles.tabBtnActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <ThemedText style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</ThemedText>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.tab} onPress={handleUploadPress}>
          <MaterialIcons name="cloud-upload" size={18} color="#6366F1" />
          <ThemedText style={styles.tabText}>Upload</ThemedText>
        </TouchableOpacity>
      </View>
      {/* Tab Content */}
      {selectedTab === 'All' && (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Recent Designs - horizontal scroll */}
          <ThemedText style={[styles.sectionHeader, { color: colors.text }]}>Recent designs</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
            {designs.map(item => (
              <ImageBackground
                key={item.id}
                source={require('@/assets/images/projectimg.jpg')}
                style={styles.recentDesignCard}
                imageStyle={{ borderRadius: 12, opacity: 0.7 }}
                resizeMode="cover"
              >
                <ThemedText style={styles.designTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.designMeta}>{item.category}  •  {item.lastModified}</ThemedText>
              </ImageBackground>
            ))}
          </ScrollView>
          {/* Folders */}
          <ThemedText style={styles.sectionHeader}>Folders</ThemedText>
          <View style={styles.folderRow}>
            {mockFolders.map(folder => (
              <TouchableOpacity key={folder.id} onPress={() => handleCardPress(folder)} activeOpacity={0.85}>
                <View style={[styles.folderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TouchableOpacity onPress={handleUploadPress} style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="cloud-upload" size={32} color="#6366F1" />
                  </TouchableOpacity>
                  <ThemedText style={styles.folderName}>{folder.name}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* Designs */}
          <ThemedText style={styles.sectionHeader}>Designs</ThemedText>
          <View style={styles.designsGrid}>
            {designs.map(item => (
              <TouchableOpacity key={item.id} onPress={() => handleCardPress(item)} activeOpacity={0.85}>
                <ImageBackground
                  source={require('@/assets/images/projectimg.jpg')}
                  style={styles.gridCard}
                  imageStyle={{ borderRadius: 12, opacity: 0.7 }}
                  resizeMode="center"
                >
                  <ThemedText style={styles.designTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.designMeta}>{item.category}  •  {item.lastModified}</ThemedText>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
          {/* Images */}
          <ThemedText style={styles.sectionHeader}>Images</ThemedText>
          <View style={styles.imagesGrid}>
            {mockImages.map(item => (
              <TouchableOpacity key={item.id} onPress={() => handleCardPress(item)} activeOpacity={0.85}>
                <ImageBackground
                  source={require('@/assets/images/projectimg.jpg')}
                  style={styles.gridCard}
                  imageStyle={{ borderRadius: 12, opacity: 0.7 }}
                  resizeMode="center"
                >
                  <ThemedText style={styles.designTitle}>{item.title}</ThemedText>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
          {/* Floating Action Button */}
          <TouchableOpacity style={styles.fab}>
            <MaterialIcons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      )}
      {selectedTab === 'Folders' && (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <ThemedText style={styles.sectionHeader}>Folders</ThemedText>
          <View style={styles.folderRow}>
            {mockFolders.map(folder => (
              <TouchableOpacity key={folder.id} onPress={() => handleCardPress(folder)} activeOpacity={0.85}>
                <View style={[styles.folderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TouchableOpacity onPress={handleUploadPress} style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="cloud-upload" size={32} color="#6366F1" />
                  </TouchableOpacity>
                  <ThemedText style={styles.folderName}>{folder.name}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {selectedTab === 'Designs' && (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <ThemedText style={styles.sectionHeader}>Designs</ThemedText>
          <View style={styles.designsGrid}>
            {designs.map(item => (
              <TouchableOpacity key={item.id} onPress={() => handleCardPress(item)} activeOpacity={0.85}>
                <ImageBackground
                  source={require('@/assets/images/projectimg.jpg')}
                  style={styles.gridCard}
                  imageStyle={{ borderRadius: 12, opacity: 0.7 }}
                  resizeMode="center"
                >
                  <ThemedText style={styles.designTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.designMeta}>{item.category}  •  {item.lastModified}</ThemedText>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {selectedTab === 'Images' && (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <ThemedText style={styles.sectionHeader}>Images</ThemedText>
          <View style={styles.imagesGrid}>
            {mockImages.map(item => (
              <TouchableOpacity key={item.id} onPress={() => handleCardPress(item)} activeOpacity={0.85}>
                <ImageBackground
                  source={require('@/assets/images/projectimg.jpg')}
                  style={styles.gridCard}
                  imageStyle={{ borderRadius: 12, opacity: 0.7 }}
                  resizeMode="center"
                >
                  <ThemedText style={styles.designTitle}>{item.title}</ThemedText>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#6366F1',
  },
  voiceButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#222',
  },
  categoriesContainer: {
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 90,
    minHeight: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.85)',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  projectsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  projectsGrid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  projectCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
  },
  projectCardContent: {
    flex: 1,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  projectIconsRow: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    gap: 4,
    zIndex: 2,
  },
  projectIcon: {
    marginLeft: 2,
  },
  badge3D: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeVoice: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  projectInfo: {
    padding: 12,
    backgroundColor: '#fff',
  },
  projectTitle: {
    fontSize: 14,
    marginBottom: 4,
    color: '#222',
  },
  projectMeta: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
    color: '#222',
  },
  categoryTag: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#222',
  },
  badgeLive: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  },
  projectCardBackground: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 4,
    minWidth: 0,
    minHeight: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  tabBtn: {
    padding: 10,
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderColor: '#6366F1',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  recentDesignCard: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  recentDesignImageWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  recentDesignImage: {
    width: '100%',
    height: '100%',
  },
  designTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    marginTop: 2,
  },
  designMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderCard: {
    padding: 10,
    marginRight: 10,
  },
  folderName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  designsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  gridCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    padding: 10,
    alignItems: 'flex-start',
  },
  gridImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  headerBackground: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 48,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    zIndex: 100,
    padding: 8,
  },
  dropdownSearch: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 6,
    marginBottom: 8,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#f3f4f6',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontWeight: '600',
    color: '#222',
    fontSize: 16,
  },
  dropdownSelectedText: {
    fontWeight: '700',
    color: '#222',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    margin: 16,
    marginBottom: 8,
  },
  section: { marginVertical: 10, backgroundColor: 'transparent' },
}); 