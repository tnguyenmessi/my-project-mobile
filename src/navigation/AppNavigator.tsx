import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomDrawerContent from './CustomDrawerContent';
import { useAuth } from '../hooks/useAuth';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ViewPageScreen from '../screens/ViewPageScreen';
import EditPageScreen from '../screens/EditPageScreen';
import LoadingIndicator from '../components/LoadingIndicator';
import { RootStackParamList, DrawerParamList } from './types';
import CreatePageScreen from '../screens/CreatePageScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainDrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            headerShown: true,
            drawerStyle: { width: '85%' },
            headerStyle: { backgroundColor: '#FF0000', elevation: 0, shadowOpacity: 0 },
            headerTintColor: '#FFFFFF',
        }}
    >
        <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Trang Chính' }} />
        <Drawer.Screen name="Search" component={SearchScreen} options={{ title: 'Tìm Kiếm' }} />
        <Drawer.Screen name="CreatePage" component={CreatePageScreen} options={{ title: 'Tạo Trang Mới' }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài Đặt' }} />
    </Drawer.Navigator>
);

const AppNavigator = () => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <>
                        <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
                        <Stack.Screen name="ViewPage" component={ViewPageScreen} options={{ headerShown: true, headerStyle: { backgroundColor: '#1C1C1E' }, headerTintColor: '#FFFFFF' }}/>
                        <Stack.Screen name="EditPage" component={EditPageScreen} options={{ headerShown: true, headerStyle: { backgroundColor: '#1C1C1E' }, headerTintColor: '#FFFFFF' }}/>
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;