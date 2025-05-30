import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text } from 'react-native-paper';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

const MediaManagerScreen: React.FC = () => {
  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={styles.container}>
        <Text style={styles.title}>Quản lý phương tiện</Text>
        <List.Section>
          <List.Item
            title="Tải lên phương tiện mới"
            left={props => <List.Icon {...props} icon="upload" />}
          />
          <List.Item
            title="Xem phương tiện đã tải lên"
            left={props => <List.Icon {...props} icon="image-multiple" />}
          />
          <List.Item
            title="Quản lý thư mục"
            left={props => <List.Icon {...props} icon="folder" />}
          />
        </List.Section>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#E53935',
  },
});

export default MediaManagerScreen; 