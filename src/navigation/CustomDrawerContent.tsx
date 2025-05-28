import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../hooks/useAuth';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      props.navigation.closeDrawer();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo-avatar.png')}
          style={styles.image}
          resizeMode="contain"
          onError={(error) => console.error('Image load error:', error.nativeEvent)}
        />
      </View>
      <View style={styles.separator} />

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerList}>
        <DrawerItem
          label="Trang chủ"
          labelStyle={styles.drawerLabel}
          icon={({ size }) => <Icon name="home" color={styles.drawerIcon.color} size={size} />}
          onPress={() => props.navigation.navigate('Home')}
        />
        <DrawerItem
          label="Tìm kiếm"
          labelStyle={styles.drawerLabel}
          icon={({ size }) => <Icon name="search" color={styles.drawerIcon.color} size={size} />}
          onPress={() => props.navigation.navigate('Search')}
        />
        <DrawerItem
          label="Tạo trang"
          labelStyle={styles.drawerLabel}
          icon={({ size }) => <Icon name="add-box" color={styles.drawerIcon.color} size={size} />}
          onPress={() => props.navigation.navigate('CreatePage')}
        />
        <DrawerItem
          label="Cài đặt"
          labelStyle={styles.drawerLabel}
          icon={({ size }) => <Icon name="settings" color={styles.drawerIcon.color} size={size} />}
          onPress={() => props.navigation.navigate('Settings')}
        />
      </DrawerContentScrollView>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color={styles.logoutText.color} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  drawerList: {
    paddingHorizontal: 10,
  },
  drawerLabel: {
    color: '#000000',
    marginLeft: -16,
    fontSize: 16,
    fontWeight: '500',
  },
  drawerIcon: {
    color: '#FF0000',
  },
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomDrawerContent;