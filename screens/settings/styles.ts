import { StyleSheet } from "react-native";
import { Styles } from "@/styles";

export const styles = StyleSheet.create({
    container: {
        flex: 1, 
        ...Styles.spacings.ph_16,
        ...Styles.spacings.pt_12,
    },
    setting_genre: {
        // Styles cho section
    },
    genre_title_block: {
        // Styles cho title block
    },
    option_setting:{
        justifyContent:'flex-start',
        ...Styles.shapes.rounded_8,
        alignItems:'center'
    },
    flexDirection:{
        flexDirection:'row',
        justifyContent:"space-between"
    },
    pt_22:{
        paddingTop:22
    },
    genre_main:{
        ...Styles.spacings.pt_12,
    },
    genre_content: {
        // Styles cho content
    },
    rectangle_button_container:{
        width:130,
        height:72,
        justifyContent:'center',
        alignItems:'center',
    },
    avatar: {
        marginBottom: 8,
    },
    option_setting_name:{
        textAlign: 'center'
    }
});