import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Text } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/DrawerNavigator';
import { useAuth } from '../hooks/useAuth';

type CustomDrawerProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};

export const CustomDrawer: React.FC<CustomDrawerProps> = ({ navigation }) => {
  const { logout } = useAuth();
  return (
    <DrawerContentScrollView>
      <View style={styles.drawerContent}>
        <View style={styles.userSection}>
          <Text style={styles.title}>THD Wiki Mobile</Text>
        </View>
        <DrawerItem
          label="Home"
          onPress={() => navigation.navigate('Home')}
        />
        <DrawerItem
          label="Page List"
          onPress={() => navigation.navigate('PageList')}
        />
        <DrawerItem
          label="Search"
          onPress={() => navigation.navigate('Search')}
        />
        <DrawerItem
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <DrawerItem
          label="Logout"
          onPress={logout}
          labelStyle={{ color: '#E53935', fontWeight: 'bold' }}
        />
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
