import React, { useEffect, useState, Fragment } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { List, Text, IconButton } from 'react-native-paper';
import { pageService, buildPageTree, PageTreeNode, Page } from '../api/pageService';
import { useNavigation } from '@react-navigation/native';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

const renderTree = (node: PageTreeNode, navigation: any, path: string[] = [], level: number = 0) => {
  return Object.entries(node.children).map(([key, child]) => {
    const currentPath = [...path, key];
    if (child.isPage) {
      return (
        <List.Item
          key={child.id}
          title={child.title || key}
          onPress={() => navigation.navigate('PageDetail', { pageId: child.id })}
          left={props => <List.Icon {...props} icon="file-document-outline" />}
          style={{ marginLeft: level * 18 }}
        />
      );
    } else {
      return (
        <List.Accordion
          key={currentPath.join(':')}
          title={key}
          left={props => <List.Icon {...props} icon="folder-outline" />}
          style={{ marginLeft: level * 18, backgroundColor: level === 0 ? '#fff' : '#fcfcfc' }}
        >
          {renderTree(child, navigation, currentPath, level + 1)}
        </List.Accordion>
      );
    }
  });
};

const SiteMapScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<PageTreeNode | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pages: Page[] = await pageService.getPageList('');
        const treeData = buildPageTree(pages);
        setTree(treeData);
      } catch (e) {
        Alert.alert('Lỗi', 'Không thể tải sơ đồ trang web.');
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingLeft: 4 }}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Sơ đồ trang web</Text>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.header}>Sơ đồ trang web</Text>
          <Text style={styles.subHeader}>
            Đây là sơ đồ trang web chứa tất cả các trang có sẵn được sắp xếp theo không gian tên.
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#E53935" style={{ marginTop: 32 }} />
          ) : tree ? (
            <List.Section>
              {renderTree(tree, navigation, [], 0)}
            </List.Section>
          ) : null}
        </ScrollView>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center',
  },
  inner: {
    padding: 16,
  },
});

export default SiteMapScreen; 