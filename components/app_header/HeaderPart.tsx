import { View } from "react-native";

// Import styles
import { styles } from "./styles";

import type { StyleProp, ViewStyle } from "react-native";

export default function HeaderPart({
  children,
  style,
}: {
  children?: React.ReactElement | boolean;
  style: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.header_col, style]}>{children}</View>;
}
