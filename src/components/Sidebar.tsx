import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
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
        ) : (
          <>
            <DrawerItem
              icon={({ color, size }) => <Icon name="home-outline" color={color} size={size} />}
              label="Trang chủ"
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Home',
                      state: {
                        index: 0,
                        routes: [{ name: 'HomeMain' }],
                      },
                    },
                  ],
                })
              }
            />
            <DrawerItem
              icon={({ color, size }) => <Icon name="sitemap" color={color} size={size} />}
              label="Sơ đồ trang web"
              onPress={() => navigation.navigate('SiteMap')}
            />
            <DrawerItem
              icon={({ color, size }) => <Icon name="image-multiple" color={color} size={size} />}
              label="Quản lý phương tiện"
              onPress={() => navigation.navigate('MediaManager')}
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
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'CreatePage' }],
                  });
                }, 250);
              }}
            />
            <DrawerItem
              icon={({ color, size }) => <Icon name="logout" color={color} size={size} />}
              label="Đăng xuất"
              onPress={async () => {
                await logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }}
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
