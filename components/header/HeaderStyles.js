import { StyleSheet } from "react-native";
import { app_sp, app_dms, app_c,app_shdw } from "globals/styles";

const styles = StyleSheet.create({
  wrapper_header: {
    width:'100%',
    height: 50,
    backgroundColor: app_c.HEX.primary,
    flexDirection: 'row',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  circle_ctrl_icon:{
    width:30,
    height:30,
    borderRadius:20,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    left:18,
    top:10,
    ...app_shdw.type_1
  },
  icon_exit:{
    fontSize:20,
  },
  header_name: {
    fontSize: 16,
    color: app_c.HEX.fourth,
    fontWeight: '700',
  },
})
export default styles
