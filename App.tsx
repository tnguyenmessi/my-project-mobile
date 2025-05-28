import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    return (
        <AuthProvider>
            <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
            <AppNavigator />
        </AuthProvider>
    );
};

export default App;