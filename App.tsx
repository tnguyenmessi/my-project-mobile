/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { StackNavigator } from './src/navigation/StackNavigator';
import { DrawerNavigator } from './src/navigation/DrawerNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { View, StyleSheet } from 'react-native';
import GlobalSearchBar from './src/components/GlobalSearchBar';
import RedAppBar from './src/components/RedAppBar';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF0000',
    secondary: '#000000',
  },
};

const MainApp = () => {
  // Không cần kiểm tra isLoggedIn ở đây nữa, luôn render StackNavigator
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <PaperProvider
          theme={theme}
        >
          <MainApp />
        </PaperProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
