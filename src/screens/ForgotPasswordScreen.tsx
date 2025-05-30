import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Hàm lấy sectok từ HTML
const getSectok = async (): Promise<string | null> => {
  const res = await fetch('https://wiki.thdcybersecurity.com/doku.php?id=start&do=resendpwd');
  const html = await res.text();
  const match = html.match(/name="sectok" value="([^"]+)"/);
  return match ? match[1] : null;
};

const sendResetPassword = async (login: string): Promise<boolean> => {
  const sectok = await getSectok();
  if (!sectok) return false;
  const formData = new FormData();
  formData.append('do', 'resendpwd');
  formData.append('id', 'start');
  formData.append('login', login);
  formData.append('sectok', sectok);

  const response = await fetch('https://wiki.thdcybersecurity.com/doku.php?id=start&do=resendpwd', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'text/html',
    },
  });
  const text = await response.text();
  if (text.includes('Một liên kết xác nhận đã được gửi qua thư điện tử')) {
    return true;
  }
  return false;
};

const ForgotPasswordScreen: React.FC = () => {
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!login) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập hoặc email!');
      return;
    }
    setLoading(true);
    const ok = await sendResetPassword(login);
    setLoading(false);
    if (ok) {
      Alert.alert('Thành công', 'Một liên kết xác nhận đã được gửi qua thư điện tử. Vui lòng kiểm tra email của bạn!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <TextInput
        label="Tên đăng nhập hoặc Email"
        value={login}
        onChangeText={setLogin}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.button}
        contentStyle={{ height: 48 }}
      >
        Gửi yêu cầu
      </Button>
      <Button onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
        Quay lại đăng nhập
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#E53935',
  },
  input: {
    width: '100%',
    marginBottom: 18,
  },
  button: {
    width: '100%',
    backgroundColor: '#E53935',
  },
});

export default ForgotPasswordScreen; 