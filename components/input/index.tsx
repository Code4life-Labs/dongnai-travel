import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from local
// Import styles
import { styles } from "./styles";

// Import types
import type { InputProps } from "./type";

export default function Input(props: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    if (props.isFromReparePublish) {
      if (!isFocused && props.value) {
        props.handleShowSuggestTitle && props.handleShowSuggestTitle();
      } else {
        props.handleHideSuggestTitle && props.handleHideSuggestTitle();
      }
    }
  }, [isFocused, props.value]);

  return (
    <FloatingLabelInput
      textContentType={props.type}
      label={props.label}
      hint={props.hint}
      isPassword={props.isPassword}
      isFocused={isFocused}
      onBlur={() => {
        setIsFocused(false);
        props.onBlur && props.onBlur();
      }}
      onFocus={() => {
        setIsFocused(true);
      }}
      labelStyles={{
        backgroundColor: theme.background,
      }}
      customLabelStyles={{
        topFocused: -25,
        fontSizeFocused: 12,
        leftBlurred: -2,
        colorBlurred: props.isError
          ? theme.error
          : isFocused
            ? theme.primary
            : theme.onOutline,
        colorFocused: props.isError
          ? theme.error
          : isFocused
            ? theme.onBackground
            : theme.onOutline,
      }}
      containerStyles={
        [
          styles.container,
          {
            borderColor: props.isError
              ? theme.error
              : isFocused
                ? theme.primary
                : theme.onOutline,
            borderWidth: isFocused ? 1.5 : 1,
          },
          props.containerStyle,
        ] as any
      }
      inputStyles={
        [
          styles.input,
          { backgroundColor: theme.background, color: theme.onBackground },
        ] as any
      }
      togglePassword={false}
      value={props.value}
      onChangeText={props.onChange}
      customShowPasswordComponent={
        <Ionicons
          name="eye-off"
          size={16}
          color={isFocused ? theme.background : theme.onOutline}
          style={styles.icon}
        />
      }
      customHidePasswordComponent={
        <Ionicons
          name="eye"
          size={16}
          color={isFocused ? theme.background : theme.onOutline}
          style={styles.icon}
        />
      }
      rightComponent={props.rightComponent}
    />
  );
}
