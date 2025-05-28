import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeStack } from './HomeStack';
import { SiteMapStack } from './SiteMapStack';
import { CustomDrawer } from '../components/Sidebar';
import UserProfileScreen from '../screens/UserProfileScreen';
import RecentChangesScreen from '../screens/RecentChangesScreen';

export type DrawerParamList = {
  Home: undefined;
  SiteMap: undefined;
  UserProfile: undefined;
  RecentChanges: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Drawer.Screen name="Home" component={HomeStack} />
    <Drawer.Screen name="SiteMap" component={SiteMapStack} />
    <Drawer.Screen name="UserProfile" component={UserProfileScreen} />
    <Drawer.Screen name="RecentChanges" component={RecentChangesScreen} />
    {/* Thêm các màn khác nếu cần */}
  </Drawer.Navigator>
);
