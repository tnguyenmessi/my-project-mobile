import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeStack } from './HomeStack';
import { SiteMapStack } from './SiteMapStack';
import { CustomDrawer } from '../components/Sidebar';
import UserProfileScreen from '../screens/UserProfileScreen';
import RecentChangesScreen from '../screens/RecentChangesScreen';
import MediaManagerScreen from '../screens/MediaManagerScreen';
import CreatePageScreen from '../screens/CreatePageScreen';
import { useAuth } from '../hooks/useAuth';

export type DrawerParamList = {
  Home: undefined;
  SiteMap: undefined;
  UserProfile: undefined;
  RecentChanges: undefined;
  MediaManager: undefined;
  CreatePage: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  const { user } = useAuth();
  const isGuest = !user || user.name === 'Guest';
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomeStack} />
      {!isGuest && <Drawer.Screen name="SiteMap" component={SiteMapStack} />}
      {!isGuest && <Drawer.Screen name="MediaManager" component={MediaManagerScreen} />}
      {!isGuest && <Drawer.Screen name="UserProfile" component={UserProfileScreen} />}
      {!isGuest && <Drawer.Screen name="RecentChanges" component={RecentChangesScreen} />}
      <Drawer.Screen name="CreatePage" component={CreatePageScreen} options={{ headerShown: false }} />
      {/* Thêm các màn khác nếu cần */}
    </Drawer.Navigator>
  );
};
