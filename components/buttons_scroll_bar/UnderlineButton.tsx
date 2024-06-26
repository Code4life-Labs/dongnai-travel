import React from "react";
import { Animated } from "react-native";

// Import from components
import AppText from "../app_text";
import RectangleButton from "../buttons/RectangleButton";

// Import from local
// Import styles
import { styles } from "./styles";

// Import utils
import { ButtonsScrollBarUtils } from "./utils";

// Import types
import type { UnderlineButtonProps } from "./type";

/**
 * Use to render a underline for `ButtonsScrollBar` only.
 * @param props
 * @returns
 * @NguyenAnhTuan1912
 */
export default function UnderlineButton(props: UnderlineButtonProps) {
  return (
    <>
      <RectangleButton
        isTransparent
        type="highlight"
        key={props.content.value + "button"}
        onPress={() => {
          ButtonsScrollBarUtils.handleButtonPress(
            props.index,
            props.content,
            props.buttonsScrollBarData,
            props.setCurrentIndex,
            props.onButtonPress
          );
        }}
      >
        {
          ((isActive: boolean, currentLabelStyle: any) => (
            <AppText weight="lighter" size="h5">
              {props.content.label}
            </AppText>
          )) as any
        }
      </RectangleButton>
      <Animated.View
        key={props.content.value + "line"}
        style={{
          ...(props.index === props.currentIndex
            ? {
                ...styles.line_index,
                backgroundColor: props.theme.outline,
              }
            : {}),
          transform: [{ translateX: props.animation }],
        }}
      ></Animated.View>
    </>
  );
}
