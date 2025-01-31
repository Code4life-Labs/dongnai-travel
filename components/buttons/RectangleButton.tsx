import React from "react";
import { View } from "react-native";

// Import from components
import AppText from "../app_text";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import styles
import { getButtonColors } from "./styles";
import { Styles } from "@/styles";

// Import from utils
import { ComponentUtils } from "@/utils/component";
import { ButtonUtils } from "./utils";

// Import types
import type { RectangleButtonProps } from "./type";

const defaultStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 30,
  ...Styles.spacings.ph_18,
  ...Styles.spacings.pv_10,
};

/**
 * Rectangle button là những button hình chữ nhật ở trong app, tuỳ theo container cha mà chiều rộng của nó cũng sẽ thay đổi theo,
 * ngoài ra thì còn hỗ trợ việc "ghi đè shape" của nó như là capsule, rounded.
 * @param props - Props của component.
 * @returns Trả về `TouchableOpacity` | `TouchableWithoutFeedback` | `TouchableHighLight` Component (tuỳ theo lựa chọn).
 * @NguyenAnhTuan1912
 */
export default function RectangleButton(props: RectangleButtonProps) {
  const { theme } = useTheme();

  // Prepare
  const Button = ComponentUtils.getTouchable(props.type);
  const colors = getButtonColors(theme);
  const buttonColors = ButtonUtils.getButtonColors(props, colors);
  const {
    isActive = false,
    isTransparent = false,
    isOnlyContent = false,
    type = "none",
    defaultColor = "type_1",
    activeColor,
    boxShadowType,
    border,
    ...rest
  } = props;

  // Build styles
  let { contentContainerStyle, currentLabelStyle } =
    ButtonUtils.buildRectangleButtonStyles(
      props,
      colors,
      defaultStyle,
      buttonColors
    );

  let ButtonChildren: any = rest.children;

  if (typeof rest.children === "function") {
    ButtonChildren = (rest.children as any)(isActive, currentLabelStyle);
  }

  if (typeof rest.children === "string") {
    ButtonChildren = (
      <AppText style={currentLabelStyle}>{rest.children}</AppText>
    );
  }

  return (
    <Button {...rest} style={type === "none" ? {} : contentContainerStyle}>
      {type === "none" ? (
        <View style={contentContainerStyle}>{<>{ButtonChildren}</>}</View>
      ) : (
        <>{ButtonChildren}</>
      )}
    </Button>
  );
}
