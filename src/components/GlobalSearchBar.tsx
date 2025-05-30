import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Searchbar, Text, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { pageService } from '../api/pageService';

const RESULTS_PER_PAGE = 10;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const DEBOUNCE_DELAY = 300;

const HighlightText = ({ text, highlight, style, highlightColor }: { text: string; highlight: string; style?: any; highlightColor?: any }) => {
  if (!highlight.trim()) return <Text style={style}>{text}</Text>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={i} style={[styles.highlight, highlightColor]}>
            {part}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
};

const GlobalSearchBar: React.FC = () => {
  const searchInputRef = useRef<any>(null);
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<any[]>([]);
  const [displayedResults, setDisplayedResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const searchTimeout = useRef<NodeJS.Timeout>();
  const navigation = useNavigation<any>();

  const animateVisibility = (show: boolean) => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: show ? 1 : 0,
        duration: show ? 200 : 150,
        useNativeDriver: true,
      }),
      Animated.timing(resultsOpacity, {
        toValue: show ? 1 : 0,
        duration: show ? 200 : 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animateVisibility(showResults);
  }, [showResults]);

  const resetSearch = () => {
    setQuery('');
    setAllResults([]);
    setDisplayedResults([]);
    setPage(1);
    setShowResults(false);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      resetSearch();
      return;
    }

    setLoading(true);
    setShowResults(true);

    try {
      const data = await pageService.search(query);

      if (!data || !Array.isArray(data)) {
        console.error('Dữ liệu không hợp lệ:', data);
        resetSearch();
        return;
      }

      const formatted = data.map(item => ({
        id: item.id,
        title: item.title || item.id,
        namespace: item.namespace || 'Trang gốc',
        snippet: item.snippet || '',
        matchType: item.matchType,
      }));

      setAllResults(formatted);
    } catch (e) {
      console.error('Lỗi khi tìm kiếm:', e);
      resetSearch();
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
  };

  const loadMoreResults = () => {
    if (loading) return;
    if (displayedResults.length >= allResults.length) return;
  
    const start = page * RESULTS_PER_PAGE;
    const nextResults = allResults.slice(start, start + RESULTS_PER_PAGE);
  
    console.log('Loading more:', start, 'to', start + RESULTS_PER_PAGE);
  
    if (nextResults.length > 0) {
      setDisplayedResults((prev) => [...prev, ...nextResults]);
      setPage((prev) => prev + 1);
    }
  };
  

  const handleSelect = (item: any) => {
    resetSearch();
    navigation.navigate('PageDetail', { pageId: item.id });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleSelect(item)} activeOpacity={0.7}>
      <List.Item
        title={item.namespace || 'Trang gốc'}
        titleStyle={styles.channelTitle}
        description={() => (
          <View>
            <Text style={styles.startTitle}>{item.title}</Text>
            {item.snippet ? (
              <HighlightText
                text={item.snippet}
                highlight={query}
                style={styles.snippet}
                highlightColor={item.matchType === 'title' ? styles.highlightRed : styles.highlightYellow}
              />
            ) : null}
            <Text style={styles.matchType}>
              Tìm thấy trong: {item.matchType === 'title' ? 'Tiêu đề' : 'Nội dung'}
            </Text>
          </View>
        )}
      />
      <Divider />
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchBarWrapper}>
        <Searchbar
          ref={searchInputRef}
          placeholder="Tìm kiếm trang và nội dung..."
          value={query}
          onChangeText={handleChangeText}
          onIconPress={handleSearch}
          onSubmitEditing={handleSearch}
          icon="magnify"
          loading={loading}
          style={styles.searchBar}
          clearIcon="close"
          onClearIconPress={resetSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <Modal
        visible={showResults}
        transparent={true}
        animationType="fade"
        onRequestClose={resetSearch}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={resetSearch}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <View style={styles.resultsContainer}>
            {query !== '' && (
              <>
                <View style={styles.resultHeader}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={resetSearch}
                  >
                    <Text style={styles.backButtonText}>← Quay về</Text>
                  </TouchableOpacity>
                  <Text style={styles.resultCount}>
                    {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${allResults.length} kết quả`}
                  </Text>
                </View>
                <FlatList
                  data={allResults}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={true}
                  indicatorStyle="black"
                  contentContainerStyle={styles.resultsList}
                  ListFooterComponent={
                    loading ? (
                      <View style={styles.footer}>
                        <ActivityIndicator size="small" color="#d32f2f" />
                        <Text style={styles.footerText}>Đang tải...</Text>
                      </View>
                    ) : null
                  }
                  ListEmptyComponent={
                    !loading ? (
                      <Text style={styles.emptyText}>
                        {query.trim() ? 'Không có kết quả' : 'Nhập từ khóa và nhấn kính lúp để tìm kiếm'}
                      </Text>
                    ) : null
                  }
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    zIndex: 1,
  },
  searchBarWrapper: {
    padding: 8,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  searchBar: {
    elevation: 2,
  },
  searchBarExpanded: {
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  resultsContainer: {
    position: 'absolute',
    top: 60,
    left: 8,
    right: 8,
    maxHeight: SCREEN_HEIGHT - 120,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resultsList: {
    paddingBottom: 16,
  },
  resultHeader: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '500',
  },
  resultCount: {
    padding: 8,
    paddingTop: 0,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e57373',
    marginBottom: 4,
  },
  startTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
  },
  snippet: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
    lineHeight: 20,
  },
  matchType: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    marginLeft: 8,
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    color: '#666',
  },
  highlight: {
    fontWeight: '500',
  },
  highlightRed: {
    backgroundColor: '#ffcdd2',
    color: '#d32f2f',
  },
  highlightYellow: {
    backgroundColor: '#fff9c4',
    color: '#fbc02d',
  },
});

export default GlobalSearchBar;
