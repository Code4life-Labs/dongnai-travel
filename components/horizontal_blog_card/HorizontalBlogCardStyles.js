import { StyleSheet } from "react-native"

import { app_c, app_sh, app_shdw, app_sp } from "globals/styles";

const default_card_text_color = {
  color: app_c.HEX.ext_second
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: app_c.HEX.primary,
    ...app_sp.p_10,
    ...app_sp.mb_12,
    ...app_shdw.type_1
  },


  card_image_container: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: 145,
    height: 145,
    backgroundColor: app_c.HEX.ext_primary,
    overflow: 'hidden',
    ...app_sh.rounded_4,
    ...app_sp.p_10,
  },

  card_recommended_mark_container: {
    justifyContent: 'center',
    backgroundColor: app_c.HEX.primary,
    ...app_sh.capsule,
    ...app_sp.ph_12,
    ...app_sp.pv_6
  },

  card_main_container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  card_content_container: {
    flex: 1,
    flexDirection: 'column'
  },

  card_user_container: {
    alignItems: 'center',
    flexDirection: 'row',
    ...app_sp.mb_12
  },

  card_title: {
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: 'bold'
  },

  car_subtitle: {
  },

  card_information_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card_information_col: {
    flex: 1,
    flexDirection: 'column'
  },

  card_buttons_container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row'
  },

  card_share_container: {
  },

  car_skeleton_rectangle: {
    width: '100%',
    height: 19,
    backgroundColor: app_c.HEX.ext_primary,
    ...app_sh.rounded_4
  },

  card_user_avatar: {
    width: 18,
    aspectRatio: 1,
    ...app_sh.circle
  }
});

export default styles