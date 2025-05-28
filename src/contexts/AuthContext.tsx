import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dokuwikiLogin, dokuwikiLogoff } from '../api/dokuWikiApi';
import { User } from '../types';

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
    logout: () => Promise<void>;
    loginAsGuest: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const loggedIn = await AsyncStorage.getItem('isLoggedIn');
                const username = await AsyncStorage.getItem('username');
                if (loggedIn === 'true' && username) {
                    setIsLoggedIn(true);
                    setUser({ name: username, email: `${username}@yourdomain.com`, avatar: require('../assets/logo-thd.png') }); // Tạm
                }
            } catch (e) {
                console.error("Failed to load auth status", e);
            } finally {
                setIsLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async (username: string, password: string, rememberMe = false): Promise<boolean> => {
        setIsLoading(true);
        const success = await dokuwikiLogin(username, password);
        if (success) {
            setIsLoggedIn(true);
            setUser({ name: username, email: `${username}@yourdomain.com`, avatar: require('../assets/logo-thd.png') });
            if (rememberMe) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                await AsyncStorage.setItem('username', username);
            }
        }
        setIsLoading(false);
        return success;
    };

    const logout = async () => {
        setIsLoading(true);
        await dokuwikiLogoff();
        setIsLoggedIn(false);
        setUser(null);
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('sessionCookie');
        setIsLoading(false);
    };

    const loginAsGuest = async () => {
        setIsLoading(true);
        setIsLoggedIn(true);
        setUser({ name: 'Guest', email: 'guest@yourdomain.com', avatar: require('../assets/logo-thd.png') });
        // Không lưu vào AsyncStorage để không giữ trạng thái guest sau khi đóng app
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, logout, loginAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
}; 