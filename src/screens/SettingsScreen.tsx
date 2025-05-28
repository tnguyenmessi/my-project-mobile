import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, List } from 'react-native-paper';

export const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Cài đặt" color="#fff" />
      </Appbar.Header>
      <List.Section>
        <List.Item title="Thông tin tài khoản" left={props => <List.Icon {...props} icon="account" />} />
        <List.Item title="Đổi mật khẩu" left={props => <List.Icon {...props} icon="lock" />} />
        <List.Item title="Đăng xuất" left={props => <List.Icon {...props} icon="logout" />} />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#d32f2f' },
});
