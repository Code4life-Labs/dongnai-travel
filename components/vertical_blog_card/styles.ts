import { Styles } from "@/styles";
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: Styles.dimension.screenWidth * 0.5,
    aspectRatio: 180 / 239,
    alignSelf: "flex-start",
    backgroundColor: Styles.theme.data.light.onSubBackground,
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
        elevation: 2,
        // borderWidth: 0.2, // Thêm borderWidth để hỗ trợ đổ bóng trên Android
        // borderColor:  app_c.HEX.ext_second, // Màu sắc của đường viền
        // shadowOpacity: 0.15,
      },
    }),
  },

  card_recommended: {
    borderWidth: 1.5,
    borderColor: Styles.theme.data.light.tertiary,
  },

  card_image: {
    width: "100%",
    aspectRatio: 16 / 10,
    backgroundColor: Styles.theme.data.light.background,
    ...Styles.shapes.rounded_4,
  },

  card_mid: {
    minHeight: 18,
    flexDirection: "row",
    alignItems: "center",
    ...Styles.spacings.mt_6,
  },

  card_content_container: {
    flex: 1,
  },

  card_content_sub_information_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    // ...Styles.spacings.mt_12,
  },

  card_buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...Styles.spacings.mt_12,
  },

  card_button: {
    justifyContent: "flex-start",
    paddingVertical: 0,
  },

  card_ske_bg: {
    backgroundColor: Styles.theme.data.light.subBackground,
  },

  card_user_avatar: {
    width: 14,
    ...Styles.shapes.circle,
    aspectRatio: 1,
  },
});

export default styles;
