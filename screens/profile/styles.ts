import { StyleSheet } from "react-native";
import { Styles } from "@/styles";

const styles = StyleSheet.create({
 
  wrapper: {
    width: Styles.dimension.screenWidth,
    height: Styles.dimension.screenHeight,
  },
  container: {
    width: Styles.dimension.screenWidth,
    paddingBottom:200,
  },
  imageCover: {
    width: '100%',
    height: 210,
  },
  circle_icon: {
    width: 30,
    height: 30,
    backgroundColor: Styles.theme.colorNames.onPrimary,
    ...Styles.shapes.circle,
    justifyContent: 'center',
    alignItems: 'center',
    ...Styles.boxShadows.type_1,
    position:"absolute",
    bottom:20,
    right:20
  },
  icon_camera: {
    color: Styles.theme.colorNames.onTertiary,
    fontSize: 18
  },
  profile_avatar: {
    alignItems: 'center'
  },
  circle_avatar: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: "center",
    marginTop: -65,
    borderRadius: 65,
    backgroundColor: Styles.theme.colorNames.onPrimary,
    ...Styles.boxShadows.type_1
  },
  avatar: {
    marginTop: -4,
    fontSize: 110
  },
  avatar_icon: {
    width: 30,
    height: 30,
    backgroundColor: Styles.theme.colorNames.primary,
    ...Styles.shapes.circle,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 6,
    bottom: 6,
    ...Styles.boxShadows.type_1
  },

  //user_info_block
  user_block: {
    ...Styles.spacings.ph_16,
    ...Styles.spacings.pt_6,
    alignItems: "center"
  },
  user_name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Styles.theme.colorNames.onTertiary
  },
  user_info_follow: {
    ...Styles.spacings.pt_6,
    flexDirection: 'row',
  },
  user_following: {
    color: Styles.theme.colorNames.onSecondary,
    ...Styles.typography.size.sz_14

  },
  user_follower: {
    color: Styles.theme.colorNames.onSecondary,
    ...Styles.typography.size.sz_14
  },
  user_infos: {
    width: '100%',
    
  },
  user_info_block:{
    ...Styles.spacings.pt_12,
  },
  user_info_title: {
    ...Styles.typography.size.sz_18,
    fontWeight: 'bold',
    color:Styles.theme.colorNames.onTertiary

  },
  user_bio_content: {
    ...Styles.spacings.pt_6,
    color:Styles.theme.colorNames.onSecondary,
    ...Styles.typography.size.sz_16
  },
  user_info_other:{
    flexDirection:'row',
    ...Styles.spacings.pt_12,
    alignItems:'center'
  },
  user_info_other_icon:{
    color:Styles.theme.colorNames.onSecondary,
    ...Styles.typography.size.sz_18
  },
  user_info_other_content:{
    ...Styles.spacings.ph_16,
    ...Styles.typography.size.sz_14,
    color:Styles.theme.colorNames.onSecondary,
  },
  user_info_address:{
    fontWeight:'bold',
  },
  line_horizontal:{
    width:'100%',
    borderBottomWidth:1,
    borderBottomColor:Styles.theme.colorNames.onSecondary,
    ...Styles.spacings.pt_12
  },
  // start blog block
  blog_block:{
    paddingHorizontal: 18
  },
  btn_create_blog:{
    width:'100%',
    height:50,
    backgroundColor:Styles.theme.colorNames.onPrimary,
    ...Styles.shapes.rounded_8,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    ...Styles.spacings.mt_22,
    
  },
  btn_create_blog_name:{
    color:Styles.theme.colorNames.onSecondary,
    ...Styles.typography.size.sz_12
  },
  btn_manage_blog:{
    height:50,
    backgroundColor:Styles.theme.colorNames.onTertiary,
    ...Styles.shapes.rounded_8,
    justifyContent:'center',
    alignItems:'center',
    ...Styles.spacings.mt_12,
  },
  btn_manage_blog_name:{
    ...Styles.typography.size.sz_12,
    color:Styles.theme.colorNames.primary,
    ...Styles.spacings.ph_16
  }, 
  blog_title_container:{
    ...Styles.spacings.mt_22,
    paddingHorizontal:16
  },
  blog_title:{
    ...Styles.typography.size.sz_18,
    fontWeight: 'bold',
    color:Styles.theme.colorNames.onTertiary
  },
  blog_container:{
    backgroundColor:Styles.theme.colorNames.onPrimary,
    ...Styles.shapes.rounded_8,
    justifyContent:'center',
    alignItems:'center',
    ...Styles.spacings.mt_12
  },
  // end blog block

  //start bottomsheet setting image
  
  choice_setting_image:{
    width:'100%',
    height:50,
    ...Styles.spacings.mt_6,
    alignItems:'center',
    flexDirection:'row',
    
  },
  choice_setting_icon:{
    color:Styles.theme.colorNames.onSecondary,
    ...Styles.spacings.ph_6
  },
  choice_setting_image_name:{
    ...Styles.typography.size.sz_18,
    color:Styles.theme.colorNames.onTertiary,
    fontWeight:'500',
  
  },
  round_rectang_button_container:{
    flexDirection:'row',  
    width:'100%',
    justifyContent:"space-between",
    ...Styles.spacings.pt_12,
    flex: 1,
  }
})
export default styles