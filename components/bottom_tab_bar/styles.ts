import { StyleSheet } from "react-native";

// Import from styles
import { Styles } from "@/styles";

const default_btn_style = {
  justifyContent: "center",
  alignItems: "center",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tab_bottom_container: {
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    width: Styles.dimension.screenWidth - 36,
    bottom: 0,
    // left: 18,
    zIndex: 999,
    ...Styles.boxShadows.type_5,
    ...Styles.shapes.rounded_8,
    // ...Styles.spacings.ph_22,
    ...Styles.spacings.pv_12,
    ...Styles.spacings.mb_18,
  },

  tab_bottom_buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tab_bottom_button: {
    // width: 30,
    aspectRatio: 1,
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    ...Styles.spacings.p_0,
  },

  // tab_bottom_icon_inactive: {
  //   ...default_btn_style,
  // },

  // tab_bottom_icon_active: {
  //   ...default_btn_style,
  // },

  tab_bottom_hl_icon_conatiner: {
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: -15 }, { translateY: -17.5 }],
    bottom: 0,
    width: 60,
    height: 60,
    borderWidth: 5,
    ...Styles.shapes.circle,
  },

  tab_bottom_dot: {
    // width: 5,
    // height: 5,
    ...Styles.shapes.circle,
    ...Styles.spacings.mt_6,
  },

  tab_bottom_icon_conatiner: {
    justifyContent: "center",
    alignItems: "center",
  },
});
