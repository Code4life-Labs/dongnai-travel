import { StyleSheet } from "react-native"

import { app_c, app_dms, app_sh, app_shdw, app_sp } from "globals/styles"

const styles = StyleSheet.create({
  bd_container: {
    backgroundColor: app_c.HEX.primary,
    flex: 1,
    ...app_sp.ph_18
  },

  bd_header: {
    justifyContent: 'space-between',
    borderBottomColor: app_c.HEX.fourth,
    borderBottomWidth: .75,
    ...app_sp.pb_12
  },

  bd_row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },

  bd_content_container: {
    ...app_sp.mt_22,
  },

  bd_content_article: {
    ...app_sp.mb_22
  },

  bd_content_image: {
    width: '100%',
    minHeight: 200,
    backgroundColor: app_c.HEX.ext_primary,
    ...app_sh.rounded_8
  },

  float_button_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 125,
    ...app_sp.ph_12,
    ...app_sp.pv_6,
    ...app_shdw.type_1,
    ...app_sh.capsule
  },
  imageNoData: {
    height: 300,
    width: 300,
    alignSelf: 'center'
  },
  avatar: {
    width: 42, 
    height: 42,  
    borderRadius: 21
    // width: 42, aspectRatio: 1, borderRadius: 9999
  },
  seperate: {
    ...app_sp.mh_8, 
    width: 1,
    height: "50%",
    backgroundColor: "#000"
  }

});

export default styles