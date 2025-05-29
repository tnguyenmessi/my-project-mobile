import React, { useState, useEffect, Fragment } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { pageService } from '../api/pageService';
import MarkdownViewer from '../components/MarkdownViewer';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';
import PageActionsFab from '../components/PageActionsFab';
import { useAuth } from '../hooks/useAuth';

const PageDetailScreen = () => {
  const route = useRoute();
  const { pageId } = (route.params || {}) as { pageId: string };
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState('');
  const { user } = useAuth();
  const canEdit = !!user && user.name !== 'Guest';
  const canDelete = !!user && user.name === 'admin';
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await pageService.getPageContent(pageId);
        setHtml(data.html);
      } catch (e) {
        Alert.alert('Lỗi', 'Không thể tải nội dung trang.');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [pageId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingLeft: 4 }}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{pageId}</Text>
      </View>
      <View style={styles.container}>
        <MarkdownViewer html={html} />
        <PageActionsFab pageId={pageId} canEdit={canEdit} canDelete={canDelete} />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default PageDetailScreen;
