import { View } from "react-native";

// Import components
import { FC } from "@/components";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FC.AppText>Welcome to explore screen</FC.AppText>
    </View>
  );
}
