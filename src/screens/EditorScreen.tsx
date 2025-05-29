import React, { Fragment, useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { IconButton, Text, Button } from 'react-native-paper';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';
import { useRoute, useNavigation } from '@react-navigation/native';
import { pageService } from '../api/pageService';

export const EditorScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { pageId } = (route.params || {}) as { pageId?: string };
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(!!pageId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPageId, setNewPageId] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions?.({
      title: pageId ? `Sửa: ${pageId}` : 'Tạo trang mới',
      headerRight: () => (
        <Button
          onPress={handleSave}
          color="#d32f2f"
          disabled={saving}
        >
          Lưu
        </Button>
      ),
    });
  }, [navigation, pageId, saving, content, summary]);

  useEffect(() => {
    if (pageId) {
      setLoading(true);
      setError(null);
      pageService.getPageContent(pageId)
        .then(data => setContent(data.content))
        .catch((err) => {
          setError('Không thể tải nội dung trang.');
        })
        .finally(() => setLoading(false));
    }
  }, [pageId]);

  const handleSave = async () => {
    const targetPageId = pageId || newPageId.trim();
    if (!targetPageId) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên trang mới!');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const ok = await pageService.putPage(targetPageId, content, summary || (pageId ? 'Edit from mobile app' : 'Create from mobile app'));
      if (ok) {
        Alert.alert('Thành công', pageId ? 'Đã lưu thay đổi!' : 'Đã tạo trang mới!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu trang. Vui lòng thử lại.');
      }
    } catch (e: any) {
      Alert.alert('Lỗi', `Đã xảy ra lỗi: ${e?.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}><ActivityIndicator size="large" color="#d32f2f" /></View>;
  }

  return (
    <Fragment>
      <RedAppBar />
      <GlobalSearchBar />
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingLeft: 4 }}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{pageId || 'Tạo trang mới'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {!pageId && (
            <TextInput
              style={styles.pageIdInput}
              placeholder="Tên trang mới (vd: wiki:ten_trang)"
              value={newPageId}
              onChangeText={setNewPageId}
              editable={!saving}
            />
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TextInput
            style={styles.textInput}
            placeholder="Nhập nội dung trang (DokuWiki markup)..."
            multiline
            value={content}
            onChangeText={setContent}
            editable={!saving && !error}
            textAlignVertical="top"
            placeholderTextColor="#666"
          />
          <TextInput
            style={styles.summaryInput}
            placeholder="Tóm tắt thay đổi (tùy chọn)..."
            value={summary}
            onChangeText={setSummary}
            placeholderTextColor="#666"
            editable={!saving && !error}
          />
          {saving && <ActivityIndicator style={styles.saver} size="small" color="#d32f2f" />}
          <View style={styles.saveButtonWrapper}>
            <IconButton
              icon="check"
              size={32}
              containerColor="#d32f2f"
              iconColor="#fff"
              onPress={handleSave}
              disabled={saving}
            />
          </View>
        </View>
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 16 },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    color: '#000',
    minHeight: 200,
    marginBottom: 10,
  },
  pageIdInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  summaryInput: {
    height: 50,
    backgroundColor: '#fff',
    color: '#000',
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  saveButtonWrapper: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saver: {
    marginVertical: 10,
  },
});

export default EditorScreen;
