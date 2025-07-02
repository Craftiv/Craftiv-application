import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';

interface SectionProps {
  title: string;
  data: any[];
  showAddButton?: boolean;
  onSeeAll?: () => void;
}

export default function Section({ title, data, showAddButton = false, onSeeAll }: SectionProps) {
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Show add button as first item for recent designs
    if (showAddButton && index === 0) {
      return <Card item={item} isAddButton={true} />;
    }
    return <Card item={item} />;
  };

  const getDataWithAddButton = () => {
    if (showAddButton) {
      return [{ id: 'add-button', label: 'Add Design', image: '' }, ...data];
    }
    return data;
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={getDataWithAddButton()}
        horizontal
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginVertical: 10, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 6 },
  title: { fontWeight: 'bold', fontSize: 18 },
  seeAll: { color: '#000000', fontWeight: 'bold', fontFamily: 'Montserrat_700Bold' },
});