import React, { useEffect, useState, Fragment } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MarkdownViewer from '../components/MarkdownViewer';
import { pageService } from '../api/pageService';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { DrawerParamList } from '../navigation/DrawerNavigator';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

const HomeScreen: React.FC = () => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  useEffect(() => {
    const fetchStartPage = async () => {
      try {
        const data = await pageService.getPageContent('start');
        if (!data.html) {
          setHtml('<div style="color:#888;text-align:center;margin-top:32px;">Trang chưa có nội dung</div>');
        } else {
          setHtml(data.html);
        }
      } catch (e) {
        setHtml('<div style="color:#888;text-align:center;margin-top:32px;">Không thể tải nội dung trang chủ.</div>');
      } finally {
        setLoading(false);
      }
    };
    fetchStartPage();
  }, []);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
