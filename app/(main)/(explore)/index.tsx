import { View } from "react-native";
import { router } from "expo-router";

// Import components
import { FC } from "@/components";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FC.AppText>Welcome to explore screen</FC.AppText>
      <FC.RectangleButton
        type="opacity"
        onPress={() => router.navigate("/details")}
      >
        Hello
      </FC.RectangleButton>
    </View>
  );
}
