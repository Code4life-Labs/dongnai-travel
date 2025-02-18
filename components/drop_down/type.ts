import { Styles } from "@/styles";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  dropdown:{
  },
  dropdown_btn:{
    height:50,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    ...Styles.spacings.ph_12,
    borderRadius:6
  },
  dropdown_label:{
    color:Styles.theme.colorNames.onTertiary,
    ...Styles.typography.size.sz_16,
  },
  dropdown_label_mode:{
    ...Styles.typography.fonts.normal.bolder.h5,
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
    borderColor: Styles.theme.colorNames.onTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  circle:{
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Styles.theme.colorNames.onTertiary,
  },
  option_name:{
    ...Styles.typography.size.sz_16
  },  
})
export default styles