import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { ErrorBoundary } from "./error-boundary";
import SplashAnimation from "@/components/SplashAnimation";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  if (showSplash) {
    return (
      <SplashAnimation 
        onAnimationComplete={() => setShowSplash(false)} 
      />
    );
  }

  return (
    <ErrorBoundary>
      <>
        <StatusBar style="light" />
        <RootLayoutNav />
      </>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth if not authenticated
      router.replace("/(auth)");
    } else if (isAuthenticated && !isOnboarded && !inOnboardingGroup) {
      // Redirect to onboarding if authenticated but not onboarded
      router.replace("/(onboarding)");
    } else if (isAuthenticated && isOnboarded && (inAuthGroup || inOnboardingGroup)) {
      // Redirect to main app if authenticated and onboarded
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isOnboarded, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: true, title: "Profile" }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: "Chat" }} />
    </Stack>
  );
}