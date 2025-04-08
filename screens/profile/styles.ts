import { StyleSheet } from "react-native";
import { Styles } from "@/styles";

const styles = StyleSheet.create({
 
  wrapper: {
    flex: 1,
  },
  container: {
    paddingBottom: 130,
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
    alignSelf: 'center',
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
    alignItems: "center",
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
    ...Styles.spacings.ph_16,
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
    
  },
  blog_title:{
    ...Styles.typography.size.sz_20,
    ...Styles.spacings.mb_10,

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
  },
  user_username: {
    fontSize: 14,
    marginTop: 4,
  },
  avatar_placeholder: {
    fontSize: 40,
    fontWeight: 'bold',
  }, 
  header_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  
  three_dot_button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  }, 
  edit_button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    position: 'absolute',
    right: 16,
    top: 160,
  },
  edit_button_icon: {
    marginRight: 5,
  },
  edit_button_text: {
    color: '#fff',
    fontWeight: '500',
  },
  menu_item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  info_row: {
    flexDirection: 'row',
    paddingVertical: 15,

  },
  blog_meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blog_date: {
    fontSize: 12,
  },
  blogStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blogStatText: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 12,
  },
  loading_container: {
    padding: 16,
  },
  blog_list: {
    padding: 16,
  },
  empty_blog_container: {
    padding: 16,
    alignItems: 'center',
  },
  empty_blog_text: {
    fontSize: 14,
  },
  blog_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButton: {
    padding: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  selectedSort: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: Styles.dimension.screenWidth,
    height: Styles.dimension.screenWidth * 1.5,
    maxHeight: Styles.dimension.screenHeight * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  follow_button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  }
})
export default styles