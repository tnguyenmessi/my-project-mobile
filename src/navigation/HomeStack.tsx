import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PageDetailScreen from '../screens/PageDetailScreen';
import { EditorScreen } from '../screens/EditorScreen';

const Stack = createNativeStackNavigator();

export const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="PageDetail" component={PageDetailScreen} />
    <Stack.Screen name="Editor" component={EditorScreen} />
  </Stack.Navigator>
); 