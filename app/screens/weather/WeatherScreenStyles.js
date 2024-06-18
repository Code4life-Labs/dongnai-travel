import { app_c, app_dms, app_sh, app_sp, app_typo } from 'globals/styles'

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    background_weather_image: {
        width: app_dms.screenWidth,
        height: app_dms.screenHeight * 0.35
    },
    main_weather_info_element: {
        height: '32%',
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main_weather_info: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    address: {
        color: '#FFF'
    },
    icon_weather_forecast: {
        width: 80,
        height: 80
    },
    temperature_block: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 180,
        justifyContent: 'space-around'
    },
    weather_forecast_degree: {
        fontSize: 30,
        color: '#FFF',
        fontWeight: 700
    },
    weather_table_info: {
        paddingBottom:100
    },
    weather_daily_info_block: {
        width: '100%',
        borderBottomColor: 'rgb(0, 0 , 0 , 0.04)',
        borderBottomWidth: 0.2,
        backgroundColor:'#F9F7F7',
        marginBottom:2,
    },
    weather_daily_info: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,


    },
    weather_daily_name: {
   

    },
    weather_daily_time:{
        fontWeight:'600',
    },
    weather_daily_value: {
        marginLeft:70
    },
    font_weather_daily_info: {
        fontSize: 16,
        fontWeight: '600'
    },
    fw_700: {
        fontWeight: '700'
    },
    weather_daily_image: {
        width: 40,
        height: 40,
        position:'absolute',
        left:135,
    },
    weather_hourly_info:{
        width: 80,
        height: '100%',

        justifyContent:'center',
        alignItems:'center',
        marginLeft:24
    },
    weather_hourly_image:{
        height:60,
        width:60
    },
    weather_hourly_table:{
        height:120,
        backgroundColor:app_c.HEX.bg_primary
    },
    weather_hourly_temperature:{
        fontSize:16,
        fontWeight:'700'
    },
    weather_time:{
        fontSize:18,
        fontWeight:'700'
    },
    weather_curr_img:{
        width:60,
        height:60
    },
    dropdown_container:{
        width:'100%',
        height:125,
        paddingHorizontal:16,
        justifyContent:'space-between',
        flexDirection:'row'
    },
    dropdown_img:{
        width:80,
        height:80
    },
    dropdown_content:{
        width:'25%',
        justifyContent:'center',
        alignItems:'center',
    },
    dropdown_desc:{
        marginTop:4,
        fontSize:14,
        fontWeight:'800',
        color:'red'
    },
    content:{
        justifyContent:'center',
        alignItems:'center',
    },
    title_info:{
        fontSize:14,
        fontWeight:'700',
        paddingVertical:4
    }

})

export default styles