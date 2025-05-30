import React, { useState, useEffect, Fragment } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, TextInput, Button, Portal, Modal, IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { pageService } from '../api/pageService';
import { useAuth } from '../hooks/useAuth';
import RedAppBar from '../components/RedAppBar';

const DEFAULT_NAMESPACES = [
  { label: 'Chọn namespace...', value: '' },
];

// Helper: lấy tất cả namespace con của 1 namespace cha
function getSubNamespaces(all: string[], parent: string) {
  const prefix = parent + ':';
  // Lấy các namespace con trực tiếp (không lồng nhiều cấp)
  const subs = all
    .filter(ns => ns.startsWith(prefix) && ns.split(':').length === parent.split(':').length + 1)
    .map(ns => ns.slice(prefix.length));
  // Loại trùng
  return Array.from(new Set(subs));
}

// Hàm filter namespace giống WikiAppTS
function getAllowedNamespaces(username: string, allNamespaces: string[]): string[] {
  if (!username) return [];
  if (username === 'admin') return allNamespaces;
  if (username === 'guest') {
    return allNamespaces.filter(ns =>
      ns === 'playground' || ns === 'solutions' || ns.startsWith('user:guest')
    );
  }
  return allNamespaces.filter(ns =>
    ns.startsWith(`user:${username}`) || ns.startsWith('shared') || ns.startsWith('projects')
  );
}

const CreatePageScreen: React.FC = () => {
  const route = useRoute();
  const { namespace: namespaceParam } = (route.params || {}) as { namespace?: string };
  const [namespace, setNamespace] = useState(namespaceParam || '');
  const [subNamespace, setSubNamespace] = useState(''); // namespace con (nếu có)
  const [pageId, setPageId] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [namespaces, setNamespaces] = useState(DEFAULT_NAMESPACES);
  const [allNamespaces, setAllNamespaces] = useState<string[]>([]);
  const [subNamespaces, setSubNamespaces] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const isGuest = !user || user.name === 'Guest';

  useEffect(() => {
    pageService.getNamespaces().then(list => {
      setAllNamespaces(list);
      // Filter namespace theo user
      const username = user?.name || '';
      const filtered = getAllowedNamespaces(username, Array.from(new Set(
        list.map(ns => ns.split(':')[0]).filter(ns => ns && ns.trim() !== '')
      )));
      setNamespaces([
        { label: 'Chọn namespace...', value: '' },
        ...filtered.map(ns => ({ label: ns, value: ns }))
      ]);
    }).catch(() => {
      setNamespaces(DEFAULT_NAMESPACES);
    });
  }, [user]);

  useEffect(() => {
    if (namespace) {
      const subs = getSubNamespaces(allNamespaces, namespace);
      setSubNamespaces(subs);
      setSubNamespace('');
    } else {
      setSubNamespaces([]);
      setSubNamespace('');
    }
  }, [namespace, allNamespaces]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton icon="menu" onPress={() => navigation.openDrawer()} />
      ),
      title: 'Tạo Trang Mới',
    });
  }, [navigation]);

  const handleCreate = () => {
    // Nếu có namespace truyền vào thì luôn dùng namespaceParam
    const ns = namespaceParam || namespace;
    if (!ns) {
      Alert.alert('Lỗi', 'Vui lòng chọn namespace!');
      return;
    }
    if (!pageId.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập ID cho trang mới!');
      return;
    }
    if (!/^[a-zA-Z0-9_:]+$/.test(pageId.trim())) {
      Alert.alert('Lỗi', 'ID chỉ được chứa chữ cái, số, dấu gạch dưới và dấu hai chấm!');
      return;
    }
    // Ghép namespace
    let fullNs = ns;
    if (subNamespace) fullNs += ':' + subNamespace;
    const fullPageId = `${fullNs}:${pageId.trim()}`;
    navigation.navigate('Editor', { pageId: fullPageId });
  };

  return (
    <Fragment>
      <RedAppBar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Tạo Trang Mới</Text>
          {namespaceParam ? (
            <Text style={styles.label}>Namespace: <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>{namespaceParam}</Text></Text>
          ) : (
            <>
              <Text style={styles.label}>Chọn Namespace:</Text>
              <TextInput
                mode="outlined"
                value={namespace ? namespaces.find(ns => ns.value === namespace)?.label : ''}
                placeholder="Chọn namespace..."
                style={styles.dropdown}
                editable={false}
                right={<TextInput.Icon icon="menu-down" color="#d32f2f" onPress={() => setShowDropdown(true)} />}
                pointerEvents="none"
                onPressIn={() => setShowDropdown(true)}
              />
              <Portal>
                <Modal visible={showDropdown} onDismiss={() => setShowDropdown(false)} contentContainerStyle={styles.modalDropdown}>
                  {namespaces.map(ns => (
                    <TouchableWithoutFeedback key={ns.value} onPress={() => {
                      setNamespace(ns.value);
                      setShowDropdown(false);
                    }}>
                      <View style={[styles.dropdownItem, ns.value === namespace && styles.selectedNs]}>
                        <Text style={[styles.dropdownItemText, ns.value === namespace && { color: '#d32f2f', fontWeight: 'bold' }]}>{ns.label}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </Modal>
              </Portal>
            </>
          )}
          {subNamespaces.length > 0 && namespace ? (
            <>
              <Text style={styles.label}>Chọn Namespace phụ (nếu có):</Text>
              <TextInput
                mode="outlined"
                value={subNamespace}
                placeholder="Chọn namespace phụ..."
                style={styles.dropdown}
                editable={false}
                right={<TextInput.Icon icon="menu-down" color="#d32f2f" onPress={() => setShowSubDropdown(true)} />}
                pointerEvents="none"
                onPressIn={() => setShowSubDropdown(true)}
              />
              <Portal>
                <Modal visible={showSubDropdown} onDismiss={() => setShowSubDropdown(false)} contentContainerStyle={styles.modalDropdown}>
                  <TouchableWithoutFeedback key="empty" onPress={() => {
                    setSubNamespace('');
                    setShowSubDropdown(false);
                  }}>
                    <View style={[styles.dropdownItem, subNamespace === '' && styles.selectedNs]}>
                      <Text style={[styles.dropdownItemText, subNamespace === '' && { color: '#d32f2f', fontWeight: 'bold' }]}>Không chọn</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  {subNamespaces.map(sub => (
                    <TouchableWithoutFeedback key={sub} onPress={() => {
                      setSubNamespace(sub);
                      setShowSubDropdown(false);
                    }}>
                      <View style={[styles.dropdownItem, sub === subNamespace && styles.selectedNs]}>
                        <Text style={[styles.dropdownItemText, sub === subNamespace && { color: '#d32f2f', fontWeight: 'bold' }]}>{sub}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </Modal>
              </Portal>
            </>
          ) : null}
          <Text style={styles.label}>Nhập ID cho trang mới:</Text>
          <TextInput
            mode="outlined"
            placeholder="ví_dụ:ten_trang_cua_ban"
            value={pageId}
            onChangeText={setPageId}
            style={styles.input}
          />
          <Button mode="contained" style={styles.button} onPress={handleCreate} buttonColor="#d32f2f" labelStyle={{ fontWeight: 'bold', fontSize: 16 }}>
            TẠO TRANG
          </Button>
          <Text style={styles.note}>
            Namespace + ID sẽ tạo thành định danh trang, ví dụ: user:bao_cao. Chỉ dùng chữ cái, số, dấu gạch dưới và dấu hai chấm.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: '#222',
    marginBottom: 6,
    marginTop: 12,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#fff',
    color: '#222',
    borderColor: '#d32f2f',
    marginBottom: 8,
  },
  modalDropdown: {
    backgroundColor: '#fff',
    margin: 32,
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#222',
  },
  selectedNs: {
    backgroundColor: '#ffeaea',
  },
  input: {
    backgroundColor: '#fff',
    color: '#222',
    borderColor: '#d32f2f',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#d32f2f',
    marginBottom: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  note: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CreatePageScreen;
export { getAllowedNamespaces }; 