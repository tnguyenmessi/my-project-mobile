import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';
import { search } from '../api/dokuWikiApi';
import { RootStackParamList, DrawerParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SearchScreenDrawerProp = DrawerNavigationProp<DrawerParamList, 'Search'>;
type SearchScreenStackProp = StackNavigationProp<RootStackParamList>;

type SearchScreenNavigationProp = CompositeNavigationProp<
    SearchScreenDrawerProp,
    SearchScreenStackProp
>;

type Props = {
    navigation: SearchScreenNavigationProp;
};

interface SearchResult {
    id: string;
    title: string;
    score: number;
    snippet?: string;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
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
            const data: SearchResult[] = await search(query);
            setResults(data);
        } catch (err: any) {
            setError(`Không thể thực hiện tìm kiếm: ${err.message || 'Lỗi không xác định'}`);
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => navigation.navigate('ViewPage', { pageId: item.id })}
        >
            <Icon name="file-document-outline" size={22} color="#666666" style={styles.itemIcon} />
            <View style={styles.itemTextContainer}>
                <Text style={styles.resultTitle}>{item.title || item.id}</Text>
                {item.snippet && <Text style={styles.resultSnippet} numberOfLines={2}>{item.snippet.replace(/<[^>]*>?/gm, '')}</Text>}
            </View>
        </TouchableOpacity>
    );

    return (
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

            {loading && <ActivityIndicator style={styles.loader} size="large" color="#FF0000" />}

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
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
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginLeft: 10,
    },
    loader: {
        marginTop: 20,
    },
    errorText: {
        color: '#FF0000',
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
});

export default SearchScreen;