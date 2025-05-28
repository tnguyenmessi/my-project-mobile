import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Searchbar, Text } from 'react-native-paper';

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // TODO: fetch results

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="THD" color="#fff" />
      </Appbar.Header>
      <Searchbar
        placeholder="Tìm kiếm..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={results}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có kết quả</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#d32f2f' },
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
