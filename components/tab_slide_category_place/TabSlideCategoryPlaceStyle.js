import { app_c } from "globals/styles";
import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
  tab:{
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: app_c.HEX.ext_primary,
  },
  active:{
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor:app_c.HEX.fourth,
   
  },
  text_active:{
    color:'#fff'
  },
  text_normal:{
    color:app_c.HEX.fourth
  }
})

export default styles