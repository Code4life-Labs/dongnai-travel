import { SafeAreaView, Alert } from "react-native";

// Import components
import { FC } from "@/components";

export default function PlaceDetailsScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <FC.AppText>Welcome to detail</FC.AppText>
      <FC.RectangleButton type="opacity" onPress={() => {}}>
        Hello
      </FC.RectangleButton>
      <FC.RectangleButton
        type="opacity"
        onPress={() => Alert.alert("Hello")}
        shape="capsule"
      >
        Ấn thử vào đây xem
      </FC.RectangleButton>
    </SafeAreaView>
  );
}
