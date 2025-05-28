import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, IconButton } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';

type PageDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PageDetail'>;
  route: RouteProp<RootStackParamList, 'PageDetail'>;
};

export const PageDetailScreen: React.FC<PageDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const { pageId } = route.params;

  useEffect(() => {
    // TODO: Fetch page content from API
    setLoading(false);
    setContent('<h1>Page Content</h1><p>This is a sample page content.</p>');
  }, [pageId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="titleLarge" style={styles.title}>
          Page Detail
        </Text>
        <IconButton
          icon="pencil"
          size={24}
          onPress={() => navigation.navigate('Editor')}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <WebView
          source={{ html: content }}
          style={styles.webview}
          originWhitelist={['*']}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
});
