import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const SettingsScreen: React.FC = () => {
    const { user } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Cài Đặt</Text>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Chế độ tối (Dark Mode)</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#FF0000" }}
                    thumbColor={isDarkMode ? "#FF0000" : "#f4f3f4"}
                    ios_backgroundColor="#767577"
                    onValueChange={toggleSwitch}
                    value={isDarkMode}
                    disabled={true}
                />
            </View>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Tên đăng nhập:</Text>
                <Text style={styles.settingValue}>{user?.name || 'N/A'}</Text>
            </View>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Email:</Text>
                <Text style={styles.settingValue}>{user?.email || 'N/A'}</Text>
            </View>

            <Text style={styles.info}>
                Tính năng đổi theme hiện chưa được triển khai đầy đủ.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 30,
        textAlign: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    settingText: {
        fontSize: 16,
        color: '#000000',
    },
    settingValue: {
        fontSize: 16,
        color: '#666666',
    },
    info: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginTop: 40,
    },
});

export default SettingsScreen;