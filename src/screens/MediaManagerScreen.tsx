import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { List, Text, Button, IconButton, Searchbar } from 'react-native-paper';
import RedAppBar from '../components/RedAppBar';
import GlobalSearchBar from '../components/GlobalSearchBar';

// Dữ liệu mẫu cho cây thư mục
const mockFolders = [
  { name: 'gốc', children: ['hcns', 'playground', 'rnd', 'service', 'thông_tin_chung', 'wiki'] },
  { name: 'hcns', children: [] },
  { name: 'playground', children: [] },
  { name: 'rnd', children: [] },
  { name: 'service', children: [] },
  { name: 'thông_tin_chung', children: [] },
  { name: 'wiki', children: [] },
];

// Dữ liệu mẫu cho file
const mockFiles = [
  {
    name: 'taotrang.png',
    size: '4.6 KB',
    date: '2025/02/12 01:07',
    dimension: '527x49',
    uri: 'https://via.placeholder.com/100x40.png?text=taotrang',
  },
  // Thêm file mẫu khác nếu muốn
];

const MediaManagerScreen: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('gốc');
  const [search, setSearch] = useState('');

  // Lọc file theo search (nếu có)
  const filteredFiles = mockFiles.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý phương tiện</Text>
      <View style={styles.topBar}>
        <Button icon="upload" mode="contained" style={styles.button} onPress={() => {}}>
          Tải lên
        </Button>
        <Searchbar
          placeholder="Tìm kiếm file..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
        />
      </View>
      <View style={styles.contentRow}>
        {/* Cây thư mục bên trái */}
        <View style={styles.folderCol}>
          <List.Section>
            {mockFolders[0].children.map(folder => (
              <List.Item
                key={folder}
                title={folder}
                left={props => <List.Icon {...props} icon="folder" />}
                onPress={() => setSelectedFolder(folder)}
                style={selectedFolder === folder ? styles.selectedFolder : undefined}
              />
            ))}
          </List.Section>
        </View>
        {/* Danh sách file bên phải */}
        <View style={styles.fileCol}>
          <FlatList
            data={filteredFiles}
            keyExtractor={item => item.name}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32 }}>Không có file nào</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.fileItem}>
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{item.name}</Text>
                  <Text style={styles.fileMeta}>{item.dimension}</Text>
                  <Text style={styles.fileMeta}>{item.date}</Text>
                  <Text style={styles.fileMeta}>{item.size}</Text>
                </View>
                <IconButton icon="dots-vertical" onPress={() => {}} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 10,
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  button: {
    borderRadius: 8,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  folderCol: {
    width: 120,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    marginRight: 8,
    paddingVertical: 8,
  },
  fileCol: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  thumbnail: {
    width: 60,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  fileMeta: {
    fontSize: 12,
    color: '#666',
  },
  selectedFolder: {
    backgroundColor: '#ffeaea',
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
});

export default MediaManagerScreen; 