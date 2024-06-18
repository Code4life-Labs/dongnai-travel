import { View } from "react-native";

// Import components
import { FC } from "@/components";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FC.AppText>Welcome to home screen</FC.AppText>
    </View>
  );
}
