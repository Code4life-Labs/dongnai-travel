import React from "react";
import { Link } from "expo-router";
import { Text, Linking } from "react-native";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from styles
import { Styles } from "@/styles";

// Import from utils
import { ComponentUtils } from "@/utils/component";

// Import types
import { AppTextProps } from "./type";

/**
 * __Creator__: @NguyenAnhTuan
 *
 * Đây là một component được tuỳ chỉnh lại từ Text Component của React Native. Dùng để chỉnh font, màu chữ nhanh chóng.
 * Ngoài ra có hỗ trợ thêm cả truyền đường dẫn vào bên trong text.
 * @param props - Props của component.
 * @returns Trả về `Text` Component có chữ và style (bao gồm fontSize đã được tuỳ chỉnh).
 */
export default function AppText({
  children,
  fontStyle = "normal",
  weight = "normal",
  size = "body1",
  color = "onBackground",
  hyperLink,
  toScreen = { screenName: "", params: {} },
  ...props
}: AppTextProps) {
  const { theme } = useTheme();

  const textCompleteStyle = ComponentUtils.mergeStyle(
    [Styles.typography.fonts[fontStyle][weight][size], { color: theme[color] }],
    props.style
  );

  // Link
  if (hyperLink && hyperLink !== "") {
    return (
      <Text
        {...props}
        style={[textCompleteStyle, { color: theme.secondary }]}
        onPress={() => Linking.openURL(hyperLink)}
      >
        {children}
      </Text>
    );
  }

  // Route
  if (toScreen.screenName !== "") {
    return (
      <Link href={{ pathname: toScreen.screenName, params: toScreen.params }}>
        <Text {...props} style={textCompleteStyle}>
          {children}
        </Text>
      </Link>
    );
  }

  return (
    <Text {...props} style={textCompleteStyle}>
      {children}
    </Text>
  );
}
