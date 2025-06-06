import React, { useState, useEffect, Fragment } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { pageService } from '../api/pageService';
import MarkdownViewer from '../components/MarkdownViewer';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';
import PageActionsFab from '../components/PageActionsFab';
import { useAuth } from '../hooks/useAuth';
import { getAllowedNamespaces } from './CreatePageScreen'; // hoặc import đúng đường dẫn nếu cần

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
        if (!data.html) {
          setHtml('<div style="color:#888;text-align:center;margin-top:32px;">Trang chưa có nội dung</div>');
        } else {
          setHtml(data.html);
        }
      } catch (e) {
        setHtml('<div style="color:#888;text-align:center;margin-top:32px;">Không thể tải nội dung trang.</div>');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [pageId]);

  const isStartPage = pageId.endsWith(':start') || pageId === 'start';
  console.log('DEBUG PageDetailScreen:', { pageId, isStartPage, canEdit });

  const namespace = pageId.replace(/:start$/, '');
  const allowedNamespaces = getAllowedNamespaces(user?.name || '', [namespace]);
  const canCreateInNamespace = allowedNamespaces.includes(namespace);

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
      {isStartPage && canCreateInNamespace && (
        <View style={{ alignItems: 'flex-end', backgroundColor: '#fff', padding: 12 }}>
          <Text
            onPress={() => navigation.navigate('CreatePage', { namespace })}
            style={styles.createBtn}
          >
            Tạo trang mới
          </Text>
        </View>
      )}
      <View style={styles.container}>
        <MarkdownViewer html={html} />
        <PageActionsFab pageId={pageId} canEdit={canEdit} canDelete={canDelete} />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  createBtn: {
    marginLeft: 12,
    color: '#fff',
    backgroundColor: '#d32f2f',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
});

export default PageDetailScreen;
