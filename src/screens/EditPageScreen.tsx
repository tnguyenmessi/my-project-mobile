import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, Text, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { getPage, putPage } from '../api/dokuWikiApi';
import { RootStackParamList } from '../navigation/types';
import LoadingIndicator from '../components/LoadingIndicator';

type Props = StackScreenProps<RootStackParamList, 'EditPage'>;

const EditPageScreen: React.FC<Props> = ({ route, navigation }) => {
    const { pageId, isNew = false } = route.params;
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isNew ? `Tạo: ${pageId}` : `Sửa: ${pageId}`,
            headerRight: () => (
                <Button
                    onPress={handleSave}
                    title="Lưu"
                    color="#FF0000"
                    disabled={saving}
                />
            ),
        });
    }, [navigation, pageId, isNew, saving, content, summary]);

    useEffect(() => {
        if (isNew) return;

        const fetchPageContent = async () => {
            setLoading(true);
            setError(null);
            try {
                const pageContent = await getPage(pageId);
                setContent(pageContent);
            } catch (err: any) {
                 if (err.message && err.message.includes('permission')) {
                    setError('Bạn không có quyền sửa trang này.');
                 } else if (err.message && err.message.includes('exist')) {
                    setError('Trang này không tồn tại.');
                 } else {
                    setError(`Không thể tải nội dung trang: ${pageId}.`);
                 }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPageContent();
    }, [pageId, isNew]);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const success = await putPage(pageId, content, summary || (isNew ? 'Created page' : 'Updated page'));
            if (success) {
                Alert.alert('Thành công', 'Trang đã được lưu.');
                navigation.replace('ViewPage', { pageId });
            } else {
                Alert.alert('Lỗi', 'Không thể lưu trang. Vui lòng thử lại.');
            }
        } catch (err: any) {
            Alert.alert('Lỗi', `Đã xảy ra lỗi: ${err.message || 'Unknown error'}`);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TextInput
                style={styles.contentInput}
                placeholder="Nhập nội dung trang (DokuWiki markup)..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#666"
                editable={!saving && !error}
            />
            <TextInput
                style={styles.summaryInput}
                placeholder="Tóm tắt thay đổi (tùy chọn)..."
                value={summary}
                onChangeText={setSummary}
                placeholderTextColor="#666"
                editable={!saving && !error}
            />
            {saving && <ActivityIndicator style={styles.saver} size="small" color="#FF0000" />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: '#FF0000',
        marginBottom: 10,
        textAlign: 'center',
    },
    contentInput: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        color: '#000000',
        padding: 15,
        borderRadius: 8,
        fontSize: 15,
        minHeight: 300,
        marginBottom: 10,
    },
    summaryInput: {
        height: 50,
        backgroundColor: '#F0F0F0',
        color: '#000000',
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 15,
        marginBottom: 20,
    },
    saver: {
        marginVertical: 10,
    },
});

export default EditPageScreen;