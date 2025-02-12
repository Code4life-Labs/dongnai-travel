import { View } from "react-native";

// Import components
import AppText from "../app_text";

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
  if (typeof children === "string") {
    return (
      <View style={[styles.header_col, style]}>
        <AppText>{children}</AppText>
      </View>
    );
  }

  return <View style={[styles.header_col, style]}>{children}</View>;
}
