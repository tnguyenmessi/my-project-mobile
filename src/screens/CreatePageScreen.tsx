import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import RNPickerSelect from 'react-native-picker-select';
import { dokuwikiLogin, getNamespaces } from '../api/dokuWikiApi';
import { getAllowedNamespaces } from '../utils/namespaceAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreatePageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainDrawer'>;

type Props = {
    navigation: CreatePageScreenNavigationProp;
};

const CreatePageScreen: React.FC<Props> = ({ navigation }) => {
    const [namespaces, setNamespaces] = useState<string[]>([]);
    const [selectedNamespace, setSelectedNamespace] = useState('');
    const [pageId, setPageId] = useState('');

    useEffect(() => {
    const loadNamespaces = async () => {
        try {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            const username = await AsyncStorage.getItem('username');
            console.log('🔐 isLoggedIn:', isLoggedIn, '👤 username:', username);
            
            if (isLoggedIn !== 'true' || !username) {
                console.log('Not logged in or no username, attempting login...');
                const loginSuccess = await dokuwikiLogin('admin', 'your_admin_password');
                if (!loginSuccess) {
                    console.error('Login failed, cannot load namespaces');
                    Alert.alert('Lỗi', 'Đăng nhập thất bại, không thể tải namespaces.');
                    return;
                }
            }
            
            const allNamespaces = await getNamespaces();
            console.log('📂 allNamespaces:', allNamespaces);
            const filtered = getAllowedNamespaces(username || '', allNamespaces);
            console.log('✅ filtered:', filtered);
            
            if (filtered.length === 0) {
                console.warn('No namespaces available after filtering');
                Alert.alert('Cảnh báo', 'Không tìm thấy namespace nào. Kiểm tra quyền truy cập hoặc liên hệ admin.');
            }
            
            setNamespaces(filtered);
        } catch (err) {
            console.error('❌ Lỗi khi tải namespace:', err);
            Alert.alert('Lỗi', 'Không thể tải danh sách namespace.');
        }
    };
    loadNamespaces();
}, []);


    const handleCreate = () => {
        const trimmedNs = selectedNamespace.trim().replace(/\s+/g, '_');
        const trimmedId = pageId.trim().replace(/\s+/g, '_');

        if (!trimmedNs || !trimmedId) {
            Alert.alert('Lỗi', 'Vui lòng chọn Namespace và nhập ID trang.');
            return;
        }

        const fullId = `${trimmedNs}:${trimmedId}`;
if (!/^[a-zA-Z0-9_:]+$/.test(fullId)) {
            Alert.alert('Lỗi', 'ID trang chỉ nên chứa chữ cái, số, gạch dưới (_) và dấu hai chấm (:).');
            return;
        }

        navigation.navigate('EditPage', { pageId: fullId, isNew: true });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tạo Trang Mới</Text>

            <Text style={styles.label}>Chọn Namespace:</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedNamespace(value)}
                items={namespaces.map(ns => ({ label: ns, value: ns }))}
                value={selectedNamespace}
                placeholder={{ label: 'Chọn namespace...', value: '' }}
                style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                    placeholder: { color: '#888' },
                }}
            />

            <Text style={styles.label}>Nhập ID cho trang mới:</Text>
            <TextInput
                style={styles.input}
                placeholder="ví_dụ:ten_trang_cua_ban"
                value={pageId}
                onChangeText={setPageId}
                autoCapitalize="none"
                placeholderTextColor="#888"
            />

            <Button title="Tạo Trang" onPress={handleCreate} />

            <Text style={styles.info}>
                Namespace + ID sẽ tạo thành định danh trang, ví dụ: <Text style={{ fontStyle: 'italic' }}>user:bao_cao</Text>. 
                Chỉ dùng chữ cái, số, dấu gạch dưới và dấu hai chấm.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF0000',
        textAlign: 'center',
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#FF0000',
        marginBottom: 10,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 8,
        color: '#333',
        fontSize: 16,
    },
    info: {
        fontSize: 13,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: 25,
        lineHeight: 18,
    }
});

export default CreatePageScreen;