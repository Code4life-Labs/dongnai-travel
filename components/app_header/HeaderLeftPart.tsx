import React from "react";
import { router } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Import from components
import { CircleButton } from "../buttons";

// Import from utils
import { BooleanUtils } from "@/utils/boolean";

// Import from local
import HeaderPart from "./HeaderPart";

// Import types
import type { AppStackHeaderProps, AppTabHeaderProps } from "./type";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Use to handle and render the left part of stack header
 * @param props
 * @returns
 */
function StackLeftPart(props: AppStackHeaderProps) {
  const navigationIndex = useNavigationState((state) => state.index);

  let child = router.canGoBack() && navigationIndex !== 0 && (
    <CircleButton
      defaultColor="type_5"
      boxShadowType="type_1"
      type="opacity"
      onPress={() => {
        router.back();
      }}
      setIcon={(isActive, currentLabelStyle) => (
        <Ionicons
          name="chevron-back-outline"
          size={18}
          style={currentLabelStyle}
        />
      )}
    />
  );

  if (props.setLeftPart) {
    child = props.setLeftPart();
  }

  return (
    <HeaderPart
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {child as any}
    </HeaderPart>
  );
}

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Use to handle and render the right part of tab header
 * @param props
 * @returns
 */
function TabLeftPart(props: AppTabHeaderProps) {
  let child;

  if (!BooleanUtils.isEmpty(props.setLeftPart)) {
    child = props.setLeftPart();
  }

  return (
    <HeaderPart
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {child}
    </HeaderPart>
  );
}

export { StackLeftPart, TabLeftPart };
