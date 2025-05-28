import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PageListScreen } from '../screens/PageListScreen';
import { PageDetailScreen } from '../screens/PageDetailScreen';
import { EditorScreen } from '../screens/EditorScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  PageList: undefined;
  PageDetail: { pageId: string };
  Editor: undefined;
  Search: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PageList" component={PageListScreen} />
      <Stack.Screen name="PageDetail" component={PageDetailScreen} />
      <Stack.Screen name="Editor" component={EditorScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
