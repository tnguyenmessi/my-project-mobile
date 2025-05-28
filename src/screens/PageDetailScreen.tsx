import React, { useState, useEffect, Fragment } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { pageService } from '../api/pageService';
import MarkdownViewer from '../components/MarkdownViewer';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

const PageDetailScreen = () => {
  const route = useRoute();
  const { pageId } = (route.params || {}) as { pageId: string };
  const [loading, setLoading] = useState(true);
  const [html, setHtml] = useState('');

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
      <View style={styles.container}>
        <MarkdownViewer html={html} />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default PageDetailScreen;
