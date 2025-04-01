import { StyleSheet, Platform } from "react-native";
import { Styles } from "@/styles";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: Styles.dimension.screenWidth * 0.5,
    aspectRatio: 180 / 235,
    alignSelf: "flex-start",
    backgroundColor: Styles.theme.data.light.primary,
    // borderWidth: 1.5,
    ...Styles.spacings.p_10,
    ...Styles.shapes.rounded_8,
    ...Platform.select({
      ios: {
        shadowColor: Styles.theme.data.light.primary,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 3.4,
      },
      android: {
        elevation: 4,
        // borderWidth: 0.2, // Thêm borderWidth để hỗ trợ đổ bóng trên Android
        // borderColor:  app_c.HEX.ext_second, // Màu sắc của đường viền
        // shadowOpacity: 0.15,
      },
    }),
  },

  card_recommended: {
    borderWidth: 1.5,
    borderColor: Styles.theme.data.light.primary,
  },

  card_image: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    aspectRatio: 16 / 10,
    backgroundColor: Styles.theme.data.light.outline,
    overflow: "hidden",
    ...Styles.shapes.rounded_4,
  },

  card_mid: {
    minHeight: 18,
    ...Styles.spacings.mt_6,
  },

  card_content_container: {
    flex: 1,
  },

  card_content_sub_information_container: {
    justifyContent: "flex-end",
  },

  card_buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card_button: {
    justifyContent: "flex-start",
    paddingVertical: 0,
  },

  card_ske_bg: {
    backgroundColor: Styles.theme.data.light.primary,
  },
});

export default styles;
