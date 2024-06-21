import { StyleSheet } from "react-native"

import { app_c, app_sh, app_shdw, app_sp, app_dms } from "globals/styles"

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: app_dms.screenWidth * 0.5,
    aspectRatio: 180 / 239,
    alignSelf: 'flex-start',
    backgroundColor: app_c.HEX.primary,
    ...app_sp.p_10,
    ...app_sh.rounded_8,
    ...app_shdw.type_1
  },

  card_recommended: {
    borderWidth: 1.5,
    borderColor: app_c.HEX.third
  },

  card_image: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: app_c.HEX.ext_primary,
    ...app_sh.rounded_4
  },

  card_mid: {
    minHeight: 18,
    flexDirection: 'row',
    alignItems: 'center',
    ...app_sp.mt_6,
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
    ...app_sp.mt_12
  },

  card_button: {
    justifyContent: 'flex-start',
    paddingVertical: 0
  },

  card_ske_bg: {
    backgroundColor: app_c.HEX.ext_primary
  },

  card_user_avatar: {
    width: 14,
    aspectRatio: 1,
    ...app_sh.circle
  }
});

export default styles