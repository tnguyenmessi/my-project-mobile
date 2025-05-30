import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SiteMapScreen from '../screens/SiteMapScreen';
import PageDetailScreen from '../screens/PageDetailScreen';

const Stack = createNativeStackNavigator();

export const SiteMapStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SiteMapMain" component={SiteMapScreen} />
    <Stack.Screen name="PageDetail" component={PageDetailScreen} />
  </Stack.Navigator>
); 