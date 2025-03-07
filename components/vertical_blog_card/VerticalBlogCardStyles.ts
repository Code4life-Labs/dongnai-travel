import { Styles } from "@/styles";
import { StyleSheet } from "react-native"


const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: Styles.dimension.width * 0.5,
    aspectRatio: 180 / 239,
    alignSelf: 'flex-start',
    backgroundColor: Styles.theme.data.light.background,
    ...Styles.spacings.p_10,
    ...Styles.boxShadows.type_1,
    ...Styles.shapes.rounded_8
  },

  card_recommended: {
    borderWidth: 1.5,
    borderColor: Styles.theme.data.light.tertiary
  },

  card_image: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: Styles.theme.data.light.background,
    ...Styles.shapes.rounded_4
  },

  card_mid: {
    minHeight: 18,
    flexDirection: 'row',
    alignItems: 'center',
    ...Styles.spacings.mt_6,
  },

  card_content_container: {
    flex: 1
  },

  card_content_sub_information_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card_buttons_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Styles.spacings.mt_12
  },

  card_button: {
    justifyContent: 'flex-start',
    paddingVertical: 0
  },

  card_ske_bg: {
    backgroundColor: Styles.theme.data.light.background
  },

  card_user_avatar: {
    width: 14,
    ...Styles.shapes.circle,
    aspectRatio: 1,
  }
});

export default styles