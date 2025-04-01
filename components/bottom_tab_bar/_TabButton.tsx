import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Import from utils
import { RouteUtils } from "@/utils/route";

// Import from local
// Import data
import TabButtonsData from "./tab_buttons.json";

// Import styles
import { styles } from "./styles";

// Import types
import type { TabButtonProps } from "./type";

export default function _TabButton(props: TabButtonProps) {
  const isFocused = props.bottomTabBarProps.state.index === props.index;
  const iconName = isFocused ? props.data.active : props.data.inactive;
  const iconStyle = isFocused ? props.inFocusStyle : props.outFocusStyle;

  const handlePressTabButton = () => {
    const event = props.bottomTabBarProps.navigation.emit({
      type: "tabPress",
      target: props.routeName,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      const href = RouteUtils.getHref(props.routeName);
      router.navigate(href);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePressTabButton}
      key={props.routeName}
      style={[styles.tab_bottom_button, { width: props.width }]}
    >
      <View style={props.iconContainerStyle}>
        <Ionicons
          size={props.data.size}
          name={iconName as any}
          style={iconStyle}
        />
      </View>
    </TouchableOpacity>
  );
}
