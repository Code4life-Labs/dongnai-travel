import { app_c, app_sh, app_sp, app_typo } from "globals/styles";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dropdown:{
  },
  dropdown_btn:{
    height:50,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    ...app_sp.ph_12,
    borderRadius:6
  },
  dropdown_label:{
    color:app_c.HEX.fourth,
    ...app_typo.size.sz_16,
  },
  dropdown_label_mode:{
    ...app_typo.fonts.normal.bolder.h5,
    paddingHorizontal:8
  },
  dropdown_content:{
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal:12
  },
  circle_outline:{
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: app_c.HEX.fourth,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  circle:{
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: app_c.HEX.fourth,
  },
  option_name:{
    color:app_c.HEX.fourth,
    ...app_typo.size.sz_16
  },  
})
export default styles