import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

const templates = [
  { id: '1', title: 'Social Media Post', image: require('../../../assets/images/project.jpg') },
  { id: '2', title: 'Business Card', image: require('../../../assets/images/project.jpg') },
  { id: '3', title: 'Flyer', image: require('../../../assets/images/project.jpg') },
  { id: '4', title: 'Resume', image: require('../../../assets/images/project.jpg') },
];

export default function ExploreScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold', margin: 20 }}>Explore</Text>
      {/* Templates Section */}
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600', marginLeft: 20, marginBottom: 8 }}>Templates</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 20, marginBottom: 24 }}>
        {templates.map((template) => (
          <TouchableOpacity key={template.id} style={styles.card}>
            <Image source={template.image} style={styles.cardImg} />
            <Text style={styles.cardTitle}>{template.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* ...other explore content... */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 180,
    backgroundColor: '#23235B',
    borderRadius: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImg: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
}); 