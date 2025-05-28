import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type Page = {
  id: string;
  title: string;
  namespace: string;
};

export const PageListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState<Page[]>([]); // TODO: Fetch from API

  const handlePagePress = (page: Page) => {
    navigation.navigate('PageDetail', { pageId: page.id });
  };

  const renderItem = ({ item }: { item: Page }) => (
    <List.Item
      title={item.title}
      description={item.namespace}
      onPress={() => handlePagePress(item)}
      right={props => <List.Icon {...props} icon="chevron-right" />}
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search pages..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={pages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pages found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
});
