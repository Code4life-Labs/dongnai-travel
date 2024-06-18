import { Platform, StyleSheet } from "react-native"

import { app_c, app_dms, app_sh, app_shdw, app_sp } from 'globals/styles'

const default_btn_style = {
  justifyContent: 'center',
  alignItems: 'center'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: app_c.HEX.primary
  },

  tab_bottom_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: app_c.HEX.fourth,
    position: 'absolute',
    width: app_dms.screenWidth - 36,
    // bottom: 18,
    // Phuong: with IpX
    bottom: 0,
    left: 18,
    zIndex: 999,
    ...app_shdw.type_5,
    ...app_sh.rounded_8,
    ...app_sp.ph_22,
    ...app_sp.pv_12,
    ...app_sp.mb_18
  },

  tab_bottom_buttons_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tab_bottom_button: {
    width: 30,
    aspectRatio: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    ...app_sp.p_0,
  },

  tab_bottom_dot_animated_container: {
    width: 5,
    height: 5,
    backgroundColor: app_c.HEX.primary,
    ...app_sh.circle,
    ...app_sp.mt_6
  },

  tab_bottom_icon_inactive: {
    ...default_btn_style,
    color: app_c.HEX.ext_second
  },

  tab_bottom_icon_active: {
    ...default_btn_style,
    color: app_c.HEX.ext_primary
  },

  tab_bottom_hl_icon_conatiner: {
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{translateX: -(15)}, {translateY: -(17.5)}],
    bottom: 0,
    width: 60,
    height: 60,
    backgroundColor: app_c.HEX.third,
    borderColor: app_c.HEX.second,
    borderWidth: 5,
    ...app_sh.circle
  },

  tab_bottom_icon_conatiner: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  tab_bottom_hl_icon_inactive: {
    ...default_btn_style,
    color: app_c.HEX.ext_primary
  },

  tab_bottom_hl_icon_active: {
    ...default_btn_style,
    color: app_c.HEX.ext_primary
  }
});

export default styles