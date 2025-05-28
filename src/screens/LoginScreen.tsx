import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và mật khẩu.');
            return;
        }
        setLoading(true);
        const success = await login(username, password);
        setLoading(false);
        if (!success) {
            Alert.alert('Lỗi', 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo-thd.png')}
                style={styles.image}
            />
            <Text style={styles.title}>Đăng nhập</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#666"
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#666"
            />
            {loading ? (
                <ActivityIndicator size="large" color="#FF0000" />
            ) : (
                <View style={styles.buttonContainer}>
                    <Button
                        title="Đăng Nhập"
                        onPress={handleLogin}
                        color="#FF0000"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    image: {
        width: 100,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        backgroundColor: '#F0F0F0',
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        color: '#000000',
        fontSize: 16,
    },
    buttonContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default LoginScreen;