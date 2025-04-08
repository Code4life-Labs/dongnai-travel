import React from "react";
import { LogBox } from "react-native";
import { Slot, SplashScreen } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";

import "react-native-reanimated";

LogBox.ignoreAllLogs();

// Import redux configurations
import { store } from "@/states/redux";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
