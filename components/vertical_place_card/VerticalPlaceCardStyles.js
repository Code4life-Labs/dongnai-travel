import { StyleSheet ,Platform} from "react-native"

import { app_c, app_sh, app_shdw, app_sp, app_dms } from "globals/styles"

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: app_dms.screenWidth * 0.5,
    aspectRatio: 180 / 235,
    alignSelf: 'flex-start',
    backgroundColor: app_c.HEX.primary,
    // borderWidth: 1.5,
    // borderColor: app_c.HEX.ext_primary,
    ...app_sp.p_10,
    ...app_sh.rounded_8,
    ...Platform.select({
      ios: {
        shadowColor: app_c.HEX.fourth,
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
    ...app_sp.mt_6,
  },

  card_content_container: {
    flex: 1
  },

  card_content_sub_information_container: {
    justifyContent: 'flex-end',
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
  }
});

export default styles