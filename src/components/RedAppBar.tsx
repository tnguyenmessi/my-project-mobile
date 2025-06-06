import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RedAppBar: React.FC = () => {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Appbar.Header style={{ backgroundColor: '#d32f2f' }}>
      <Appbar.Action icon="menu" color="#fff" onPress={() => navigation.openDrawer()} />
      <Appbar.Content 
        title="THD Wiki" 
        color="#fff" 
        titleStyle={{ fontWeight: 'bold', fontSize: 20 }} 
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
      />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action icon="dots-vertical" color="#fff" onPress={() => setMenuVisible(true)} />
        }
      >
        <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('RecentChanges'); }} title="Thay đổi gần đây" />
      </Menu>
    </Appbar.Header>
  );
};

export default RedAppBar; 