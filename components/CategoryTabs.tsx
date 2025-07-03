import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the type for our category items
type Category = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  bgColor: string;
  iconColor: string;
  route?: string; // Add optional route property
};

const categories: Category[] = [
  { icon: 'image', label: 'Your story', bgColor: '#FF10F440', iconColor: '#FF10F4', route: '/YourStories' }, 
  { icon: 'play-box', label: 'Mobile Video', bgColor: '#FF10F4', iconColor: '#FFFFFF' },
  { icon: 'tshirt-crew', label: 'T-Shirt', bgColor: '#C22EF340', iconColor: '#5927EC' },
  { icon: 'account-group', label: 'Social Media', bgColor: '#EF191C', iconColor: '#FFFFFF' },
  { icon: 'camera', label: 'Photo Editor', bgColor: '#FF2290', iconColor: '#FFFFFF' },
//   { icon: 'dots-horizontal-circle-outline', label: 'More', bgColor:'#F3EEF3', iconColor:'#000000' },
];

const extraCategories: Category[] = [
    { icon: 'file-table', label: 'Sheets', bgColor: '#4285F440', iconColor: '#4285F4' },
    { icon: 'presentation', label: 'Presentation', bgColor: '#34A85340', iconColor: '#34A853' },
    { icon: 'file-document-edit', label: 'Doc', bgColor: '#FBBC0540', iconColor: '#FBBC05', route: '/(drawer)/DocsEditor' },
    { icon: 'web', label: 'Website', bgColor: '#EA433540', iconColor: '#EA4335' },
  ];

export default function CategoryTabs() {
    const [showMore, setShowMore] = useState(false);
    const router = useRouter();
    const categoriesToShow = showMore 
    ? [...categories, ...extraCategories]
    : categories;

  const handleCategoryPress = (category: Category) => {
    if (category.route) {
      router.push(category.route as any);
    }
    // For other categories, you can add navigation logic later
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {categoriesToShow.map((cat, idx) => (
        <TouchableOpacity 
          key={idx} 
          style={styles.tab}
          onPress={() => handleCategoryPress(cat)}
        >
            <View style={[styles.iconCircle, { backgroundColor: cat.bgColor }]}>
          <MaterialCommunityIcons name={cat.icon} size={24} color={cat.iconColor} />
          </View>
          <Text style={styles.label}>{cat.label}</Text>
        </TouchableOpacity>
      ))}

<TouchableOpacity style={styles.tab} onPress={() => setShowMore(!showMore)}>
        <View style={[styles.iconCircle, { backgroundColor: '#F3EEF3' }]}>
          <MaterialCommunityIcons
            name={showMore ? 'chevron-left-circle-outline' : 'dots-horizontal-circle-outline'}
            size={24}
            color="#000000"
          />
        </View>
        <Text style={styles.label}>{showMore ? 'Less' : 'More'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 10, paddingLeft: 10, backgroundColor: '#FFFFFF' },
  tab: { alignItems: 'center', marginRight: 20, },
  label: { fontSize: 12, color: '#333', marginTop: 4 ,fontFamily: 'Montserrat_700Regular'},
  iconCircle: { width: 40, height: 40, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }
});