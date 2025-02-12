import React from "react";
import { View, Animated } from "react-native";
import TypeScrollView from "../buttons_scroll_bar";
import { styles } from "./styles";
import type { TabSliderProps } from "./type";

const AppTabSlider = ({
  children,
  lineIndexTranslateXStart = 20,
  slideTranslateXStart = 100,
  selectTabIndex,
}: TabSliderProps) => {
  if (!children || !children.length) return children || null;

  const [currentSlideIndex, setSlideIndex] = React.useState(0);
  const sliderInfoRef = React.useRef({
    prevSlideIndex: 0,
    isSliderButtonPress: false,
  });
  const renderedSlideRefs = React.useRef<{ renderedSlides: React.ReactNode[] }>(
    {
      renderedSlides: [],
    }
  );

  const listSlideName = React.useMemo(
    () =>
      children.map((child) => ({
        value: child.props.name || null,
        label: child.props.name || null,
      })),
    [children]
  );

  const direction =
    currentSlideIndex > sliderInfoRef.current.prevSlideIndex ? 1 : -1;
  const translateAnim = React.useRef(
    new Animated.Value(slideTranslateXStart * direction)
  ).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  const animateSlide = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateAnim, opacityAnim]);

  const handleButtonPress = React.useCallback(
    (index: number) => {
      if (selectTabIndex) selectTabIndex(index);
      sliderInfoRef.current.isSliderButtonPress = true;
      setSlideIndex((prevIndex) => {
        sliderInfoRef.current.prevSlideIndex = prevIndex;
        return index;
      });
      animateSlide();
    },
    [selectTabIndex, animateSlide]
  );

  if (!renderedSlideRefs.current.renderedSlides[currentSlideIndex]) {
    renderedSlideRefs.current.renderedSlides[currentSlideIndex] =
      children[currentSlideIndex];
  }

  return (
    <View style={styles.slider_container}>
      <TypeScrollView
        buttonContents={listSlideName}
        onButtonPress={(_, index) => handleButtonPress(index)}
        buttonType="underline"
        lineIndexTranslateXStart={lineIndexTranslateXStart}
        containerStyle={{ position: "relative", zIndex: 2 }}
      />
      <View style={styles.slide_container}>
        <Animated.View
          style={[
            {
              flex: 1,
              position: "relative",
              transform: [{ translateX: translateAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {renderedSlideRefs.current.renderedSlides.map(
            (renderedChild, index) => (
              <Slide
                key={listSlideName[index].value}
                isOnTop={currentSlideIndex === index}
              >
                {renderedChild}
              </Slide>
            )
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const Slide = ({
  isOnTop,
  children,
  ...props
}: {
  isOnTop: boolean;
  children: React.ReactNode;
}) => (
  <View {...props} style={isOnTop ? styles.slide_show : styles.slide}>
    {children}
  </View>
);

const Child = ({ component }: { component: () => JSX.Element }) => component();

AppTabSlider.Child = Child;
export default AppTabSlider;
