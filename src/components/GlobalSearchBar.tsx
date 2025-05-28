import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Text, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { pageService } from '../api/pageService';

const GlobalSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      // Gọi API tìm kiếm, ví dụ: pageService.searchPages(text)
      const data = await pageService.searchPages(text); // Trả về mảng {id, title}
      setResults(data);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    setQuery('');
    setResults([]);
    navigation.navigate('PageDetail', { pageId: item.id });
  };

  return (
    <View style={styles.wrapper}>
      <Searchbar
        placeholder="Tìm kiếm trang..."
        value={query}
        onChangeText={handleSearch}
        style={styles.searchBar}
        loading={loading}
      />
      {query.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          style={styles.resultList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <List.Item
                title={item.title || item.id}
                left={props => <List.Icon {...props} icon="file-document-outline" />}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có kết quả</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 4,
  },
  searchBar: {
    marginHorizontal: 0,
    borderRadius: 0,
  },
  resultList: {
    maxHeight: 320,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    padding: 16,
  },
});

export default GlobalSearchBar; 