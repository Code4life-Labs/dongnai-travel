import React from "react";
import { View } from "react-native";

// Import from components
import AppText from "../app_text";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from utils
import { ComponentUtils } from "@/utils/component";
import { ButtonUtils } from "./utils";

// Import styles
import { getButtonColors } from "./styles";
import { Styles } from "@/styles";

// Import types
import type { CircleButtonProps } from "./type";

const defaultStyle = {
  justifyContent: "center",
  alignItems: "center",
  minWidth: 30,
  minHeight: 30,
  ...Styles.shapes.circle,
  ...Styles.spacings.p_10,
};

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Circle Button là những button nhỏ ở trong app, có hình dạng là một hình tròn. Button này chỉ
 * có icon.
 * @param props Props của component.
 * @returns Trả về `TouchableOpacity` | `TouchableWithoutFeedback` | `TouchableHighLight` Component (tuỳ theo lựa chọn).
 */
export default function CircleButton(props: CircleButtonProps) {
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
    setIcon,
    border,
    ...rest
  } = props;

  // Build styles
  let { contentContainerStyle, currentLabelStyle } =
    ButtonUtils.buildButtonStyles(props, colors, defaultStyle, buttonColors);

  return (
    <Button {...rest} style={type === "none" ? {} : contentContainerStyle}>
      <View style={type === "none" ? contentContainerStyle : {}}>
        {typeof setIcon === "function" ? (
          setIcon(isActive, currentLabelStyle)
        ) : (
          <AppText style={currentLabelStyle}>{setIcon}</AppText>
        )}
      </View>
    </Button>
  );
}
