import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../../constants/api';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSignup = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/signup/', {
                username,
                email,
                password,
            });

            if (response.data.token) {
                console.log('Signup successful, token:', response.data.token);
                await signUp(response.data.token);
                // router.replace('/(tabs)') removed; RootLayout handles redirect
            }
        } catch (error: any) {
            let msg = 'Signup failed';
            if (error.response?.data) {
                // Handle object errors (like {username: ["Taken"]})
                const data = error.response.data;
                if (typeof data === 'object') {
                    const firstKey = Object.keys(data)[0];
                    // If duplicate key logic here
                    msg = `${firstKey}: ${data[firstKey][0]}`;
                } else {
                    msg = data.toString();
                }
            }
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center px-6 bg-white dark:bg-slate-900">
            <Text className="text-3xl font-bold mb-8 text-black dark:text-white">Create Account</Text>

            <TextInput
                className="w-full bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4 text-black dark:text-white"
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                className="w-full bg-gray-100 dark:bg-slate-800 p-4 rounded-lg mb-4 text-black dark:text-white"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                onPress={handleSignup}
                disabled={loading}
            >
                <Text className="text-white font-bold text-lg">
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600 dark:text-gray-400">Already have an account? </Text>
                <Link href="/auth/login" asChild>
                    <TouchableOpacity>
                        <Text className="text-blue-600 font-bold">Login</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
