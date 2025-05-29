import React, { useState } from 'react';
import { StyleSheet, View, Alert, Share } from 'react-native';
import { FAB, Portal, Dialog, Button, List } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

interface Props {
  pageId: string;
  canEdit: boolean;
  canDelete: boolean;
}

const PageActionsFab: React.FC<Props> = ({ pageId, canEdit, canDelete }) => {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const handleEdit = () => {
    setOpen(false);
    navigation.navigate('Editor', { pageId });
  };

  const handleDelete = () => {
    setOpen(false);
    setConfirmDelete(true);
  };

  const confirmDeletePage = () => {
    setConfirmDelete(false);
    // TODO: Gọi API xóa trang, reload lại trang hoặc chuyển về Home
    Alert.alert('Xóa trang', 'Chức năng xóa trang sẽ được bổ sung sau.');
  };

  const handleCopyLink = () => {
    setOpen(false);
    const url = `https://wiki.thdcybersecurity.com/doku.php?id=${pageId}`;
    Clipboard.setString(url);
    Alert.alert('Đã sao chép liên kết', url);
  };

  const handleViewHistory = () => {
    setOpen(false);
    Alert.alert('Phiên bản cũ', 'Chức năng xem lịch sử sẽ được bổ sung sau.');
  };

  const handleScrollTop = () => {
    setOpen(false);
    // TODO: Scroll về đầu trang (cần truyền ref từ PageDetailScreen)
    Alert.alert('Scroll', 'Chức năng scroll lên trên sẽ được bổ sung sau.');
  };

  return (
    <Portal>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setOpen(true)}
        color="#fff"
      />
      <Dialog visible={open} onDismiss={() => setOpen(false)}>
        <Dialog.Title>Chức năng trang</Dialog.Title>
        <Dialog.Content>
          <List.Item
            title="Sửa đổi trang này"
            left={props => <List.Icon {...props} icon="pencil" />}
            onPress={handleEdit}
            disabled={!canEdit}
          />
          <List.Item
            title="Xóa trang"
            left={props => <List.Icon {...props} icon="delete" />}
            onPress={handleDelete}
            disabled={!canDelete}
          />
          <List.Item
            title="Liên kết đến đây"
            left={props => <List.Icon {...props} icon="link-variant" />}
            onPress={handleCopyLink}
          />
          <List.Item
            title="Phiên bản cũ"
            left={props => <List.Icon {...props} icon="history" />}
            onPress={handleViewHistory}
          />
          <List.Item
            title="Quay lên trên"
            left={props => <List.Icon {...props} icon="arrow-up" />}
            onPress={handleScrollTop}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setOpen(false)}>Đóng</Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog visible={confirmDelete} onDismiss={() => setConfirmDelete(false)}>
        <Dialog.Title>Xác nhận xóa</Dialog.Title>
        <Dialog.Content>
          <List.Item title={`Bạn có chắc muốn xóa trang "${pageId}"?`} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setConfirmDelete(false)}>Hủy</Button>
          <Button onPress={confirmDeletePage} textColor="#d32f2f">Xóa</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#d32f2f',
    zIndex: 9999,
  },
});

export default PageActionsFab; 