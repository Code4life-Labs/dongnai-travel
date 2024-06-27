import React from "react";
import { View, Animated } from "react-native";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from local
// Import components
import TabButton from "./TabButton";
import HighlightTabButton from "./HighlightTabButton";

// Import data
import TabButtonsData from "./tab_buttons.json";

// Import styles
import { styles } from "./styles";

// Import utils
import { BottomTabBarUtils } from "./utils";

// Import types
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { TabButtonProps } from "./type";

/**
 * Use this component to render a customized bottom tab bar
 * @param props
 * @returns
 * @FromSunNews
 * @NguyenAnhTuan1912
 */
export default function BottomTabBar(props: BottomTabBarProps) {
  const { theme } = useTheme();

  const dotWidth = 5;
  const buttonCounts = props.state.routes.length;
  const buttonContainerWidth = 30;
  const bottomBarleftAmount = 18;
  const bottomBarHorizontalPaddingAmount = 22;

  const { dotMovementDistance, centerDotDistance } =
    BottomTabBarUtils.calculatDotTranslationParams(
      buttonContainerWidth,
      buttonCounts,
      dotWidth,
      bottomBarHorizontalPaddingAmount,
      bottomBarleftAmount
    );

  const dotTranslateXAnimation = React.useRef(
    new Animated.Value(centerDotDistance)
  ).current;

  // Run animation
  BottomTabBarUtils.runDotMovementAnimation(
    dotTranslateXAnimation,
    props.state.index,
    dotMovementDistance,
    centerDotDistance
  );

  props.state.routes;

  return (
    <View
      style={[
        styles.tab_bottom_container,
        {
          backgroundColor: theme.primary,
          left: bottomBarleftAmount,
          paddingHorizontal: bottomBarHorizontalPaddingAmount,
        },
      ]}
    >
      <View style={styles.tab_bottom_buttons_container}>
        {props.state.routes.map((route, index) => {
          const tabBottomProps: TabButtonProps = {
            data: (TabButtonsData as any)[route.name],
            index,
            routeKey: route.key,
            routeName: route.name,
            width: buttonContainerWidth,
            theme,
            bottomTabBarProps: props,
          };

          return (TabButtonsData as any)[route.name].isHighlight ? (
            <HighlightTabButton {...tabBottomProps} />
          ) : (
            <TabButton {...tabBottomProps} />
          );
        })}
      </View>
      <Animated.View
        style={{
          ...styles.tab_bottom_dot,
          width: dotWidth,
          height: dotWidth,
          backgroundColor: theme.onPrimary,
          transform: [{ translateX: dotTranslateXAnimation }],
        }}
      ></Animated.View>
    </View>
  );
}
