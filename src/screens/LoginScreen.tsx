import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, loginAsGuest } = useAuth();
    const navigation = useNavigation<any>();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
            return;
        }
        setLoading(true);
        const success = await login(username, password, rememberMe);
        setLoading(false);
        if (!success) {
            Alert.alert('Đăng nhập thất bại', 'Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại!');
        }
    };

    return (
        <LinearGradient
            colors={["#E53935", "#FF7043", "#F5F5F5", "#fff"]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            {/* Hiệu ứng nền sóng */}
            <View style={styles.wave1} />
            <View style={styles.wave2} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <View style={styles.logoWrap}>
                    <View style={styles.logoRow}>
                        <Image source={require('../assets/logo-thd.png')} style={styles.logo} />
                        <Text style={styles.thd}>THD</Text>
                    </View>
                    <Text style={styles.slogan}>The Innovative Technology Leader</Text>
                </View>
                <View style={styles.formBox}>
                    <Text style={styles.loginTitle}>Login</Text>
                    <TextInput
                        label="Email"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        mode="outlined"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="email-outline" />}
                    />
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        left={<TextInput.Icon icon="lock-outline" />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off-outline" : "eye-outline"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />
                    <View style={styles.rowBetween}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                                status={rememberMe ? 'checked' : 'unchecked'}
                                onPress={() => setRememberMe(!rememberMe)}
                                color="#E53935"
                            />
                            <Text style={styles.remember}>Remember me</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgot}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                        mode="contained"
                        style={styles.loginBtn}
                        loading={loading}
                        onPress={handleLogin}
                        buttonColor="#E53935"
                        contentStyle={{ height: 48 }}
                        labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
                    >
                        Log In
                    </Button>
                    <Button
                        mode="outlined"
                        style={styles.guestBtn}
                        onPress={loginAsGuest}
                        textColor="#E53935"
                        contentStyle={{ height: 44 }}
                        labelStyle={{ fontWeight: 'bold', fontSize: 15 }}
                    >
                        Guest
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wave1: {
        position: 'absolute',
        top: -60,
        left: -80,
        width: width * 1.2,
        height: 180,
        backgroundColor: '#FFEBEE',
        borderBottomRightRadius: 200,
        opacity: 0.25,
        zIndex: 0,
    },
    wave2: {
        position: 'absolute',
        bottom: -60,
        right: -80,
        width: width * 1.2,
        height: 180,
        backgroundColor: '#FFEBEE',
        borderTopLeftRadius: 200,
        opacity: 0.18,
        zIndex: 0,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 1,
    },
    logoWrap: {
        alignItems: 'center',
        marginBottom: 18,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    logo: {
        width: 60,
        height: 60,
        marginRight: 12,
        resizeMode: 'contain',
    },
    thd: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#444',
        letterSpacing: 2,
        textShadowColor: 'rgba(255,255,255,0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    slogan: {
        fontSize: 16,
        color: '#B71C1C',
        fontWeight: '500',
        textAlign: 'center',
        textShadowColor: 'rgba(255,255,255,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
        marginTop: 2,
        marginBottom: 10,
    },
    formBox: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 22,
        width: width * 0.88,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.13,
        shadowRadius: 12,
        elevation: 8,
        alignItems: 'stretch',
    },
    loginTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#E53935',
        alignSelf: 'center',
        marginBottom: 16,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    remember: {
        fontSize: 14,
        color: '#444',
    },
    forgot: {
        fontSize: 14,
        color: '#E53935',
        textDecorationLine: 'underline',
    },
    loginBtn: {
        marginTop: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    guestBtn: {
        borderRadius: 8,
        borderColor: '#E53935',
        borderWidth: 1.5,
    },
});

export default LoginScreen;
