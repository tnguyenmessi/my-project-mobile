import React, { Fragment, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string }[]>([]); // TODO: fetch results

  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={styles.container}>
        <Searchbar
          placeholder="Tìm kiếm..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchBar}
        />
        <FlatList
          data={results}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }: { item: { title: string } }) => (
            <View style={styles.resultItem}>
              <Text>{item.title}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có kết quả</Text>}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: { margin: 16 },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#888',
  },
});
