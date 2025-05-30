import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { pageService } from '../api/pageService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

export const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);
    try {
      const data = await pageService.search(query);
      setResults(data);
    } catch (err: any) {
      setError(`Không thể thực hiện tìm kiếm: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('PageDetail', { pageId: item.id })}
    >
      <Icon name="file-document-outline" size={22} color="#666666" style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.resultTitle}>{item.title || item.id}</Text>
        {item.snippet && (
          <Text style={styles.resultSnippet} numberOfLines={2}>
            {item.snippet.replace(/<[^>]*>?/gm, '')}
          </Text>
        )}
        {item.namespace ? <Text style={styles.resultNamespace}>{item.namespace}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập từ khóa..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
            <Icon name="magnify" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator style={styles.loader} size="large" color="#d32f2f" />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && searched && results.length === 0 && (
          <Text style={styles.noResultsText}>Không tìm thấy kết quả nào cho "{query}"</Text>
        )}
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 15,
    borderRadius: 8,
    color: '#000000',
    fontSize: 16,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 10,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsText: {
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  resultTitle: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '600',
  },
  resultSnippet: {
    color: '#666666',
    fontSize: 14,
    marginTop: 4,
  },
  resultNamespace: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
});

export default SearchScreen;
