import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../hooks/useAuth';

export const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const { logout, user } = useAuth();
  const { navigation } = props;
  const isGuest = !user || user.name === 'Guest';
  return (
    <DrawerContentScrollView>
      <View style={styles.drawerContent}>
        <View style={styles.userSection}>
          <Image source={require('../assets/logo-thd.png')} style={styles.avatar} />
          <Text style={styles.title}>
            {isGuest ? 'Tài Khoản Khách (guest)' : user?.name}
          </Text>
        </View>
        {isGuest ? (
          <DrawerItem
            icon={({ color, size }) => <Icon name="login" color={color} size={size} />}
            label="Đăng nhập"
            onPress={() => navigation.navigate('Login')}
            labelStyle={{ color: '#E53935', fontWeight: 'bold' }}
          />
        ) : null}
        {!isGuest && (
          <>
            <DrawerItem
              icon={({ color, size }) => <Icon name="home-outline" color={color} size={size} />}
              label="Trang chủ"
              onPress={() => navigation.navigate('Home')}
            />
            <DrawerItem
              icon={({ color, size }) => <Icon name="account-circle-outline" color={color} size={size} />}
              label="Hồ sơ cá nhân"
              onPress={() => navigation.navigate('UserProfile')}
            />
            <DrawerItem
              icon={({ color, size }) => <Icon name="plus-box-outline" color={color} size={size} />}
              label="Tạo trang mới"
              onPress={() => {
                navigation.closeDrawer();
                setTimeout(() => {
                  navigation.getParent()?.navigate('CreatePage');
                }, 250);
              }}
              labelStyle={{ color: '#388e3c', fontWeight: 'bold' }}
            />
            <DrawerItem
              icon={({ color, size }) => <Icon name="logout" color={color} size={size} />}
              label="Đăng xuất"
              onPress={logout}
              labelStyle={{ color: '#E53935', fontWeight: 'bold' }}
            />
          </>
        )}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
