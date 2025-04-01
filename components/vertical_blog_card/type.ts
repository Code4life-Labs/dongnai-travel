// Import types
import type { StyleProp, ViewStyle } from "react-native";
import type { Blog } from "@/objects/blog/type";

export type VerticalBlogCardProps = {
  data: Partial<Blog>;
  isChatBotScreen?: boolean;
  style?: StyleProp<ViewStyle>;
  type: string;
};
