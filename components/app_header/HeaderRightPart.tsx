import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import from components
import CircleButton from "@/components/buttons/CircleButton";

// Import from utils
import { BooleanUtils } from "@/utils/boolean";

// Import from local
import { styles } from "./styles";
import { AppHeaderUtils } from "./utils";

// Import types
import type { AppStackHeaderProps, AppTabHeaderProps } from "./type";

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
  let child = (
    <CircleButton
      defaultColor="type_5"
      boxShadowType="type_1"
      type="opacity"
      setIcon={<Ionicons name="search-outline" size={18} />}
      onPress={() => {
        props.navigation.navigate("GlobalNavigator", {
          screen: "SearchScreen",
        });
      }}
    />
  );

  if (!BooleanUtils.isEmpty(props.setLeftPart)) {
    child = props.setLeftPart();
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
