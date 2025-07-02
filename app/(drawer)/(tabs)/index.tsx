import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import CategoryTabs from '../../../components/CategoryTabs';
import Header from '../../../components/Header';
import Section from '../../../components/Section';
import { useDesigns } from '../../../contexts/DesignContext';

// Dummy data for other sections
const whiteboardData = [
  { id: '1', label: 'Whiteboard', image: 'https://placehold.co/120x90/fff/000?text=Whiteboard' },
  { id: '2', label: 'Whiteboard', image: 'https://placehold.co/120x90/fff/000?text=Whiteboard' },
];
const storyTemplatesData = [
  { id: '1', label: 'Instagram Story', image: 'https://placehold.co/120x90/FF6B9D/fff?text=Instagram' },
  { id: '2', label: 'Facebook Story', image: 'https://placehold.co/120x90/1877F2/fff?text=Facebook' },
  { id: '3', label: 'Snapchat Story', image: 'https://placehold.co/120x90/FFFC00/000?text=Snapchat' },
  { id: '4', label: 'TikTok Story', image: 'https://placehold.co/120x90/000000/fff?text=TikTok' },
];
const docsData = [
  { id: '1', label: 'Doc', image: 'https://placehold.co/120x90/ddd/000?text=Doc' },
  { id: '2', label: 'Doc', image: 'https://placehold.co/120x90/ddd/000?text=Doc' },
];

// Add DocTemplate type
interface DocTemplate {
  id: string;
  text: string;
  color: string;
  fontFamily: string;
  isBold: boolean;
}

export default function HomeScreen() {
  const { recentDesigns } = useDesigns();
  const router = useRouter();
  const [docsTemplates, setDocsTemplates] = useState<DocTemplate[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('docsTemplates');
      if (stored) setDocsTemplates(JSON.parse(stored));
    })();
  }, []);

  const handleSeeAllStories = () => {
    router.push('/YourStories' as any);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header />
      <ScrollView>
        <CategoryTabs />
        

        
        {/* <QuickActions /> */}
        <Section title="Recent Designs" data={recentDesigns} showAddButton={true} />
        <Section title="Whiteboard" data={whiteboardData} />
        <Section 
          title="Your stories" 
          data={storyTemplatesData} 
          onSeeAll={handleSeeAllStories}
        />
        <Section title="Docs" data={docsTemplates.map(t => ({ id: t.id, label: t.text ? t.text.slice(0, 20) + (t.text.length > 20 ? '...' : '') : 'Doc', image: '', preview: t.text }))} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function HomeTab() {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.text}>Welcome to the Home Tab!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    columnGap: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  designButton: {
    backgroundColor: '#FF2290',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  designButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});