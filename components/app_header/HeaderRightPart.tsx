import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import from components
import CircleButton from "@/components/buttons/CircleButton";

// Import from utils
import { BooleanUtils } from "@/utils/boolean";

// Import from local
// Import styles
import { styles } from "./styles";

// Import utils
import { AppHeaderUtils } from "./utils";

// Import types
import type { AppStackHeaderProps, AppTabHeaderProps } from "./type";
import { useRouter } from "expo-router";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Use to handle and render the left part of header
 * @param props
 * @returns
 */
export default function RightPart(
  props: AppStackHeaderProps | AppTabHeaderProps
) {
  const router = useRouter();
  let child = (
    <CircleButton
      defaultColor="type_5"
      boxShadowType="type_1"
      type="opacity"
      setIcon={<Ionicons name="search-outline" size={18} />}
      onPress={() => {
        router.push("/(app)/search");
      }}
    />
  );

  if (!BooleanUtils.isEmpty(props.setRightPart)) {
    child = props.setRightPart();
  }

  return (
    <View
      style={[
        styles.header_col,
        {
          justifyContent: "flex-end",
          alignItems: "center",
        },
      ]}
    >
      {child}
    </View>
  );
}
