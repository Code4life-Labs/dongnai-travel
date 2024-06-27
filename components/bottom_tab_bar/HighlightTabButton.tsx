import React from "react";

// Import from local
// Import components
import _TabButton from "./_TabButton";

// Import styles
import { styles } from "./styles";

// Import types
import type { TabButtonProps } from "./type";

/**
 * Use this component to render a highlight tab button
 * @param props
 * @returns
 * @NguyenAnhTuan1912
 */
export default function HighlightTabButton(props: TabButtonProps) {
  return (
    <_TabButton
      {...props}
      inFocusStyle={{ color: props.theme.onPrimary }}
      outFocusStyle={{ color: props.theme.background }}
      iconContainerStyle={[
        styles.tab_bottom_hl_icon_conatiner,
        {
          backgroundColor: props.theme.secondary,
          borderColor: props.theme.background,
        },
      ]}
    />
  );
}
