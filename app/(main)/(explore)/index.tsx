import { View, Alert } from "react-native";

// Import components
import { FC } from "@/components";

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FC.AppText>Welcome to explore screen</FC.AppText>
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
      <FC.UnorderedList>
        <FC.ListItem>Hello</FC.ListItem>
        <FC.ListItem>World</FC.ListItem>
        <FC.ListItem>Welcome</FC.ListItem>
        <FC.ListItem>To</FC.ListItem>
        <FC.ListItem>My</FC.ListItem>
        <FC.ListItem>React</FC.ListItem>
        <FC.ListItem>Native</FC.ListItem>
        <FC.ListItem>App!!!</FC.ListItem>
        <FC.ListItem>
          <FC.UnorderedList>
            <FC.ListItem>I</FC.ListItem>
            <FC.ListItem>Am</FC.ListItem>
            <FC.ListItem>Performing</FC.ListItem>
            <FC.ListItem>The</FC.ListItem>
            <FC.ListItem>Unordered Nested List</FC.ListItem>
          </FC.UnorderedList>
        </FC.ListItem>
        <FC.ListItem>Unordered Nested List</FC.ListItem>
        <FC.ListItem>Is</FC.ListItem>
        <FC.ListItem>Performed</FC.ListItem>
      </FC.UnorderedList>

      <FC.OrderedList>
        <FC.ListItem>Hello</FC.ListItem>
        <FC.ListItem>World</FC.ListItem>
        <FC.ListItem>Welcome</FC.ListItem>
        <FC.ListItem>To</FC.ListItem>
        <FC.ListItem>My</FC.ListItem>
        <FC.ListItem>React</FC.ListItem>
        <FC.ListItem>Native</FC.ListItem>
        <FC.ListItem>App!!!</FC.ListItem>
        <FC.ListItem>
          <FC.OrderedList>
            <FC.ListItem>I</FC.ListItem>
            <FC.ListItem>Am</FC.ListItem>
            <FC.ListItem>Performing</FC.ListItem>
            <FC.ListItem>The</FC.ListItem>
            <FC.ListItem>Ordered Nested List</FC.ListItem>
          </FC.OrderedList>
        </FC.ListItem>
        <FC.ListItem>Ordered Nested List</FC.ListItem>
        <FC.ListItem>Is</FC.ListItem>
        <FC.ListItem>Performed</FC.ListItem>
      </FC.OrderedList>
    </View>
  );
}
