import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "../global.css";

function RootLayoutNav() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    console.log('RootLayout logging:', { userToken, segments, inAuthGroup });

    if (!userToken && !inAuthGroup) {
      // No token and not in auth group -> redirect to login
      console.log('Redirecting to login');
      router.replace("/auth/login");
    } else if (userToken && inAuthGroup) {
      // Token exists and in auth group -> redirect to tabs
      console.log('Redirecting to tabs');
      router.replace("/(tabs)");
    }
  }, [userToken, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
