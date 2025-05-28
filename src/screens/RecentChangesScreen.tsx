import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, List } from 'react-native-paper';
import { pageService } from '../api/pageService';
import { useNavigation } from '@react-navigation/native';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

const RecentChangesScreen: React.FC = () => {
  const [changes, setChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchChanges = async () => {
      setLoading(true);
      const data = await pageService.getRecentChanges(0);
      setChanges(data);
      setLoading(false);
    };
    fetchChanges();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PageDetail', { pageId: item.id })}>
      <List.Item
        title={item.id}
        description={() => (
          <View>
            <Text style={styles.meta}>{formatDate(item.timestamp)} • {item.user}</Text>
            {item.summary ? <Text style={styles.summary}>{item.summary}</Text> : null}
          </View>
        )}
        left={props => <List.Icon {...props} icon="history" color="#d32f2f" />}
      />
    </TouchableOpacity>
  );

  function formatDate(ts: number) {
    const d = new Date(ts * 1000);
    return d.toLocaleString();
  }

  return (
    <>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={styles.container}>
        <Text style={styles.header}>Thay đổi gần đây</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#d32f2f" style={{ marginTop: 32 }} />
        ) : (
          <FlatList
            data={changes}
            keyExtractor={item => item.id + item.timestamp}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>Không có thay đổi nào gần đây.</Text>}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 8 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#d32f2f' },
  meta: { fontSize: 13, color: '#888' },
  summary: { fontSize: 14, color: '#333', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 32, color: '#888' },
});

export default RecentChangesScreen; 