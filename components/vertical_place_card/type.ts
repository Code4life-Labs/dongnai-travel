// Import types
import type { StyleProp, ViewStyle } from "react-native";
import type { Place } from "@/objects/place/type";

export type VerticalPlaceCardProps = {
  data: Partial<Place>;
  isChatBotScreen?: boolean;
  style?: StyleProp<ViewStyle>;
  type: string;
};
