import React from "react";
import { View, SafeAreaView } from "react-native";
import { Stack, router, SplashScreen, Slot } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider as RNSafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";

// Import components
import { FC } from "@/components";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useStatus } from "@/hooks/useStatus";
import { SafeAreaProvider, useSafeAreaConfig } from "@/hooks/useSafeArea";

// Import utils
import { StorageUtils } from "@/utils/storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Component to conditionally apply SafeAreaView
const ConditionalSafeAreaView = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { useSafeArea } = useSafeAreaConfig();
  const { theme } = useTheme();

  if (true) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {children}
      </SafeAreaView>
    );
  }

  // When useSafeArea is false, return only View without SafeAreaView
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {children}
    </View>
  );
};

export default function AppLayout() {
  const { theme } = useTheme();
  const { user, canRemember, authDispatchers } = useAuth();
  const { status } = useStatus();

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
    if (status.isFirstTimeLaunch) {
      setTimeout(() => router.replace("/onboarding"), 0);
    }

    if (user) {
      setTimeout(() => router.replace("/home"), 0);
    }
  }, [user, status.isFirstTimeLaunch]);

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
    <RNSafeAreaProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ConditionalSafeAreaView>
            <FC.GlobalLoading />
            <Stack>
              <Stack.Screen
                name="(main)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="(sub)"
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  animation: "fade",
                }}
              />
              <Stack.Screen
                name="search"
                options={{
                  header: FC.AppHeader,
                  title: "Search",
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="sign-up"
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="otp"
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="forgot-password"
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="reset-password"
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="onboarding"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="html"
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="not-found"
                options={{
                  headerShown: false,
                  animation: "fade",
                }}
              />
            </Stack>
            <FC.ReportSection />
          </ConditionalSafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </RNSafeAreaProvider>
  );
}
