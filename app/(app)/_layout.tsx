import React from "react";
import { SafeAreaView } from "react-native";
import { Stack, router, SplashScreen, Slot } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Import components
import { FC } from "@/components";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";

// Import utils
import { StorageUtils } from "@/utils/storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { theme } = useTheme();
  const { user, canRemember, authDispatchers } = useAuth();

  const [fontsLoaded] = useFonts({
    "Roboto-Black": require("@/assets/fonts/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("@/assets/fonts/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("@/assets/fonts/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("@/assets/fonts/Roboto-BoldItalic.ttf"),
    "Roboto-Italic": require("@/assets/fonts/Roboto-Italic.ttf"),
    "Roboto-Light": require("@/assets/fonts/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("@/assets/fonts/Roboto-LightItalic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("@/assets/fonts/Roboto-MediumItalic.ttf"),
    "Roboto-Regular": require("@/assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Thin": require("@/assets/fonts/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("@/assets/fonts/Roboto-ThinItalic.ttf"),
  });

  // Check user
  React.useEffect(() => {
    if (user) {
      console.log("User:", user);
      setTimeout(() => router.replace("/home"), 0);
    }
  }, [user]);

  // Load token
  React.useEffect(() => {
    StorageUtils.getItemAsync("REMEMBERED_USER").then((data) => {
      if (data)
        authDispatchers.signin({
          emailName: data.user.username,
          token: data.token,
        });
    });
  }, []);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <Slot />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <FC.GlobalLoading />
        <GestureHandlerRootView>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(main)" />
            <Stack.Screen name="index" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="reset-password" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="not-found" />
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
