import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login/', {
                username,
                password,
            });

            if (response.data.token) {
                console.log('Login successful, token:', response.data.token);
                await signIn(response.data.token);
                // router.replace('/(tabs)') removed; RootLayout handles redirect
            } else {
                console.log('Login response missing token:', response.data);
            }
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Login failed';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center px-6 bg-white dark:bg-slate-900">
            <Text className="text-3xl font-bold mb-8 text-black dark:text-white">Welcome Back</Text>

            <TextInput
                className="w-full bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4 text-black dark:text-white"
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                className="w-full bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-6 text-black dark:text-white"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                className={`w-full bg-blue-600 p-4 rounded-lg items-center ${loading ? 'opacity-70' : ''}`}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text className="text-white font-bold text-lg">
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600 dark:text-gray-400">Don't have an account? </Text>
                <Link href="/auth/signup" asChild>
                    <TouchableOpacity>
                        <Text className="text-blue-600 font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
