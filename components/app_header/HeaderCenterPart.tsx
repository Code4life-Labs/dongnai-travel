import React from "react";
import { View } from "react-native";

// Import from components
import AppText from "../app_text";

// Import from utils
import { BooleanUtils } from "@/utils/boolean";

// Import from local
// Import styles
import { styles } from "./styles";

// Import utils
import { AppHeaderUtils } from "./utils";

// Import types
import type { AppStackHeaderProps, AppTabHeaderProps } from "./type";

export default function CenterPart(
  props: AppStackHeaderProps | AppTabHeaderProps
) {
  const title = AppHeaderUtils.getTitle(props);
  let child = (
    <AppText weight="lighter" size="h5" style={{ textAlign: "center" }}>
      {title}
    </AppText>
  );

  if (!BooleanUtils.isEmpty(props.setCenterPart)) child = props.setCenterPart();

  return (
    <View
      style={[
        styles.header_col,
        {
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {child}
    </View>
  );
}
