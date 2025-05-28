import React, { useState, Fragment } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

const UserProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const isGuest = !user || user.name === 'Guest';

  const [realName, setRealName] = useState(user?.name === 'Guest' ? 'Tài Khoản Khách' : user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleSave = () => {
    // TODO: Gọi API cập nhật hồ sơ
    // Hiện tại chỉ alert
    Alert.alert('Thông báo', 'Chức năng cập nhật hồ sơ chưa được hỗ trợ!');
  };

  const handleReset = () => {
    setRealName(user?.name === 'Guest' ? 'Tài Khoản Khách' : user?.name || '');
    setEmail(user?.email || '');
    setNewPassword('');
    setRepeatPassword('');
    setCurrentPassword('');
  };

  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Cập nhật hồ sơ tài khoản của bạn</Text>
          <Text style={styles.subHeader}>
            Bạn chỉ cần hoàn thành những trường bạn muốn thay đổi. Bạn không thể thay đổi tên thành viên của bạn.
          </Text>
          <View style={styles.form}>
            <Text style={styles.formTitle}>Hồ sơ thành viên</Text>
            <TextInput
              label="Tên thành viên"
              value={user?.name || ''}
              disabled
              style={styles.input}
            />
            <TextInput
              label="Tên thật"
              value={realName}
              onChangeText={setRealName}
              style={styles.input}
              disabled={isGuest}
            />
            <TextInput
              label="Thư điện tử"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              disabled={isGuest}
            />
            <TextInput
              label="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry
              disabled={isGuest}
            />
            <TextInput
              label="Lặp lại mật khẩu mới"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              style={styles.input}
              secureTextEntry
              disabled={isGuest}
            />
            <TextInput
              label="Xác nhận mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
              secureTextEntry
              disabled={isGuest}
            />
            <View style={styles.buttonRow}>
              <Button mode="contained" onPress={handleSave} disabled={isGuest} style={styles.button}>
                Lưu
              </Button>
              <Button mode="outlined" onPress={handleReset} style={styles.button}>
                Đặt lại
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
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
  form: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default UserProfileScreen; 