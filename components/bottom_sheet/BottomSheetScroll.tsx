import React from "react";
import { Pressable } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { useTheme } from "@/hooks/useTheme";

// Import components
import RectangleButton from "../buttons/RectangleButton";
import AppText from "../app_text";

// Import styles
import { styles } from "./styles";

// Import types
import { BottomSheetScrollProps } from "./type";
import { pad } from "lodash";

const BottomSheetScroll = ({
  haveHeader = false,
  haveBtn = true,
  haveOverlay = true,
  isOpen = false,
  close,
  children,
  snapPoints,
  labelBtn,
  handleLabelBtn,
  handleStyle,
  bottomSheetStyle,
  bottomSheetScrollViewStyle,
  labelBtnStyle,
  childHeader,
}: BottomSheetScrollProps) => {
  const { theme } = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet | null>(null);

  const handleClosePress = () => {
    close();
    bottomSheetRef.current?.close();
  };

  if (isOpen)
    return (
      <>
        {haveOverlay && (
          <Pressable style={styles.modal} onPress={handleClosePress} />
        )}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => close()}
          backgroundStyle={styles.bottomSheetContainer}
          handleStyle={[{ backgroundColor: theme.background }, handleStyle]}
          style={bottomSheetStyle}
          handleIndicatorStyle={{ backgroundColor: theme.onBackground }}
          enableDynamicSizing
        >
          {haveHeader && (
            <BottomSheetView style={{ backgroundColor: theme.background }}>
              {childHeader}
            </BottomSheetView>
          )}
          <BottomSheetScrollView
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={[
              styles.bottomView,
              bottomSheetScrollViewStyle,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
            {haveBtn && (
              <RectangleButton
                style={[styles.btn, labelBtnStyle]}
                onPress={handleLabelBtn}
              >
                {(isActive, currentLabelStyle) => (
                  <AppText
                    size="h4"
                    style={[styles.btnText, currentLabelStyle]}
                  >
                    {labelBtn}
                  </AppText>
                )}
              </RectangleButton>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
};

export default BottomSheetScroll;
