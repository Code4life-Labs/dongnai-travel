import React from "react";
import { ScrollView, View, Animated } from "react-native";

// Import from components
import AppText from "../app_text";
import RectangleButton from "../buttons/RectangleButton";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";
import { useStateManager } from "@/hooks/useStateManager";

// Import from styles
import { Styles } from "@/styles";

// Import from utils
import { BooleanUtils } from "@/utils/boolean";

// Import from local
// Import components
import UnderlineButton from "./UnderlineButton";

// Import state
import { StateManager } from "./state";

// Import styles
import { styles } from "./styles";

// Import utils
import { ButtonsScrollBarUtils } from "./utils";

// Import types
import type { ButtonsScrollBarProps, ButtonsScrollBarLocalData } from "./type";

/**
 * Use this component to render a horizontal scroll view for buttons by a list (array)
 * of object of `label` and `value`. This scroll view automatically adjusts itself to
 * center.
 * @param props Props của component.
 * @returns Một `ScrollView` có các button.
 * @NguyenAnhTuan1912
 */
export default function ButtonsScrollBar(props: ButtonsScrollBarProps) {
  const { theme } = useTheme();

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const scrollRef = React.useRef<ScrollView>(null);
  const localData = React.useRef<ButtonsScrollBarLocalData>({
    scrollToXList: [],
    previousIndex: 0,
    buttonScrollContainerWidth: 0,
    isButtonPress: false,
  });

  const direction =
    state.currentIndex > localData.current.previousIndex ? 1 : -1;
  const lineTranslateAmination = new Animated.Value(
    (props.lineIndexTranslateXStart || 0) * direction * -1
  );

  ButtonsScrollBarUtils.scrollViewToRightPosition(
    scrollRef.current,
    localData.current,
    state,
    lineTranslateAmination
  );

  if (BooleanUtils.isEmpty(props.buttonContents)) {
    console.warn(
      "ButtonsScrollBar requires a list of ButtonContent for rendering"
    );
    return null;
  }

  return (
    <View style={[{ width: "100%" }, props.containerStyle]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={props.scrollStyle}
        onLayout={(e) => {
          const { width } = e.nativeEvent.layout;
          localData.current.buttonScrollContainerWidth = width;
          stateFns.setIsViewLayouted(true);
        }}
      >
        {props.buttonContents.map((content, index) => (
          <View
            key={content.value + "container"}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              localData.current.scrollToXList[index] =
                ButtonsScrollBarUtils.calculateScrollToCenterValue(
                  localData.current.buttonScrollContainerWidth,
                  x,
                  width,
                  props.buttonType
                );
            }}
          >
            {props.buttonType !== "underline" ? (
              <RectangleButton
                defaultColor="type_5"
                activeColor="type_1"
                isActive={state.currentIndex === index}
                shape={props.buttonType || "capsule"}
                key={content.value + "button"}
                onPress={() => {
                  ButtonsScrollBarUtils.handleButtonPress(
                    index,
                    content,
                    localData.current,
                    stateFns.setCurrentIndex,
                    props.onButtonPress
                  );
                }}
                style={Styles.spacings.me_12}
              >
                {(isActive: boolean, currentLabelStyle: any) => (
                  <AppText size="body1" style={currentLabelStyle}>
                    {content.label}
                  </AppText>
                )}
              </RectangleButton>
            ) : (
              <UnderlineButton
                index={index}
                currentIndex={state.currentIndex}
                content={content}
                animation={lineTranslateAmination}
                buttonsScrollBarData={localData.current}
                theme={theme}
                onButtonPress={props.onButtonPress}
                setCurrentIndex={stateFns.setCurrentIndex}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
