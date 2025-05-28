import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

export const SettingsScreen = () => {
  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={styles.container}>
        <List.Section>
          <List.Item title="Thông tin tài khoản" left={props => <List.Icon {...props} icon="account" />} />
          <List.Item title="Đổi mật khẩu" left={props => <List.Icon {...props} icon="lock" />} />
          <List.Item title="Đăng xuất" left={props => <List.Icon {...props} icon="logout" />} />
        </List.Section>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
