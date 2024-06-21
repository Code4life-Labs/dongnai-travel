import { View, Alert } from "react-native";

// Import components
import { FC } from "@/components";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FC.AppText>Welcome to explore screen</FC.AppText>
      <FC.Btn.Rectangle type="opacity" onPress={() => {}}>
        Hello
      </FC.Btn.Rectangle>
      <FC.Btn.Rectangle
        type="opacity"
        onPress={() => Alert.alert("Hello")}
        shape="capsule"
      >
        Ấn thử vào đây xem
      </FC.Btn.Rectangle>
    </View>
  );
}
