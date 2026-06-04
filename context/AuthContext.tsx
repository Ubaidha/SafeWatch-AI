import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { api } from '../constants/api';

type AuthContextType = {
    userToken: string | null;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signUp: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    userToken: null,
    isLoading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

// Storage helper
const Storage = {
    setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    getItem: async (key: string) => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },
    deleteItem: async (key: string) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreToken = async () => {
            try {
                const token = await Storage.getItem('userToken');
                if (token) {
                    setUserToken(token);
                    // Set default header for future requests
                    api.defaults.headers.common['Authorization'] = `Token ${token}`;
                }
            } catch (e) {
                console.error('Failed to restore token', e);
            } finally {
                setIsLoading(false);
            }
        };

        restoreToken();
    }, []);

    const signIn = async (token: string) => {
        console.log('SignIn called with token:', token);
        // Update state immediately to trigger redirect
        setUserToken(token);
        api.defaults.headers.common['Authorization'] = `Token ${token}`;

        try {
            await Storage.setItem('userToken', token);
        } catch (e) {
            console.error('Failed to save token to storage', e);
        }
    };

    const signUp = async (token: string) => {
        console.log('SignUp called with token:', token);
        // Update state immediately to trigger redirect
        setUserToken(token);
        api.defaults.headers.common['Authorization'] = `Token ${token}`;

        try {
            await Storage.setItem('userToken', token);
        } catch (e) {
            console.error('Failed to save token to storage', e);
        }
    };

    const signOut = async () => {
        try {
            await Storage.deleteItem('userToken');
            setUserToken(null);
            delete api.defaults.headers.common['Authorization'];
        } catch (e) {
            console.error('Failed to delete token', e);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
