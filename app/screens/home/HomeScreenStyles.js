import { app_c, app_dms, app_sh, app_shdw, app_sp, app_typo } from 'globals/styles'

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: app_c.HEX.primary,
    
  },
  home_content: {
    width: '100%',
    paddingBottom:150
  },
  home_banner: {
    height:200,
  },
  home_temperature: {
    paddingHorizontal:16,
    ...app_sp.mt_22,
    width: '100%',
    ...app_sh.rounded_8,
    borderRadius:20,
       shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 13.97,
    elevation: 20,
  },
  temperature: {
    width:'100%',
    height: 140,
    flexDirection: 'row',    
    ...app_sh.rounded_8,

  },
  temperature_degrees: {
    width: app_dms.screenWidth * 0.3,
    height: '100%',
    justifyContent:'center',
    alignItems:'center',
    
  },
  temperature_degrees_icon:{
    width:60,
    height:60
  },
  temperature_degrees_info:{
    ...app_typo.fonts.normal.normal.h1,
    color:app_c.HEX.ext_second,
  },
  temperature_other_info:{
    width: app_dms.screenWidth * 0.7 - 32,
    height:70,
    marginTop:16,
  },
  temperature_other_info_half: {
    height:30,
    marginBottom:5,
    marginTop:5,
    flexDirection:'row',
    alignItems:"center",


    
  },
  temperature_other_info_quarter:{
   flexDirection:'row'

  },
  temperature_reload: {
    width: app_dms.screenWidth * 0.17,
    height: app_dms.screenWidth * 0.17,
    backgroundColor: app_c.HEX.ext_primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...app_sh.rounded_8
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...app_sh.rounded_8
  },
  category_header: {
    ...app_sp.mt_12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    // paddingHorizontal:16,
    paddingLeft: 16,
  },
  category_name: {
    ...app_typo.fonts.normal.bolder.h3
  },
  category_option_list: {
    ...app_sp.mt_12
  },
  category_list_item:{ 
    ...app_sp.mt_12,
    
  }
 

})
export default styles