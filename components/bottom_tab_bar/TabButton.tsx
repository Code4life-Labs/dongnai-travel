import React from "react";

// Import from local
// Import components
import _TabButton from "./_TabButton";

// Import styles
import { styles } from "./styles";

// Import types
import type { TabButtonProps } from "./type";

/**
 * Use this component to render a standard tab button
 * @param props
 * @returns
 * @NguyenAnhTuan1912
 */
export default function TabButton(props: TabButtonProps) {
  return (
    <_TabButton
      {...props}
      inFocusStyle={{ color: props.theme.onPrimary }}
      outFocusStyle={{ color: props.theme.onSubOutline }}
      iconContainerStyle={styles.tab_bottom_icon_conatiner}
    />
  );
}
