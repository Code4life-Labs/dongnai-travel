import { StyleSheet } from "react-native";
import { Styles } from "@/styles";

const styles = StyleSheet.create({
    weather_header: {
        backgroundColor: Styles.theme.colorNames.primary,
        paddingVertical: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 16,
        ...Styles.boxShadows.type_2,
    },
    main_weather_info: {
        alignItems: 'center',
    },
    main_weather_info_element: {
        marginVertical: 8,
        alignItems: 'center',
    },
    address: {
        color: Styles.theme.colorNames.onPrimary,
        marginBottom: 4,
    },
    dateTime: {
        color: Styles.theme.colorNames.onPrimary,
        opacity: 0.8,
    },
    temperature_block: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginVertical: 8,
    },
    weather_curr_img: {
        width: 80,
        height: 80,
    },
    weather_forecast_degree: {
        fontSize: 48,
        color: Styles.theme.colorNames.onPrimary,
        fontWeight: '700',
    },
    weather_current_desc: {
        color: Styles.theme.colorNames.onPrimary,
        opacity: 0.9,
        textAlign: 'center',
        marginTop: 8,
    },
    weather_current_value: {
        color: Styles.theme.colorNames.onPrimary,
        fontWeight: '600',
    },
    weather_table_info: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    weather_daily_info_block: {
        backgroundColor: '#FFF',
        marginBottom: 8,
        borderRadius: 12,
        ...Styles.boxShadows.type_1,
    },
    weather_daily_info: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    weather_daily_name: {
        flex: 1,
    },
    weather_daily_image: {
        marginHorizontal: 12,
    },
    weather_daily_value: {
        flex: 1,
        textAlign: 'right',
    },
    font_weather_daily_info: {
        fontSize: 16,
        fontWeight: '600',
    },
    dropdown_container: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    dropdown_content: {
        flex: 1,
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginVertical: 4,
    },
    title_info: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    weather_daily_time: {
        fontWeight: '600',
    },
    icon_weather_forecast: {
        width: 80,
        height: 80
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
        backgroundColor:Styles.theme.colorNames.primary
    },
    weather_hourly_temperature:{
        fontSize:16,
        fontWeight:'700'
    },
    weather_time:{
        fontSize:18,
        fontWeight:'700'
    },
    dropdown_img:{
        width:80,
        height:80
    },
    dropdown_desc:{
        marginTop:4,
        fontSize:14,
        fontWeight:'800',
        color:'red'
    },
    fw_700: {
        fontWeight: '700'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    gradient_container: {
        paddingTop: 40,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 40,
    },
    menu_button: {
        padding: 8,
    },
    location_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    location_text: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 4,
    },
    current_weather: {
        alignItems: 'center',
        marginBottom: 40,
    },
    current_temp: {
        fontSize: 96,
        fontWeight: '200',
        color: '#FFF',
        lineHeight: 100,
    },
    weather_condition: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 8,
    },
    high_low_temp: {
        fontSize: 16,
        color: '#FFF',
        opacity: 0.9,
    },
    hourly_container: {
        marginBottom: 20,
    },
    hourly_scroll: {
        paddingHorizontal: 16,
    },
    hourly_item: {
        alignItems: 'center',
        marginRight: 24,
    },
    hourly_time: {
        color: '#FFF',
        fontSize: 14,
        marginBottom: 8,
    },
    hourly_icon: {
        marginVertical: 8,
    },
    hourly_temp: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    precipitation_container: {
        paddingHorizontal: 16,
    },
    precipitation_line: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 40,
    },
    precipitation_dot: {
        alignItems: 'center',
    },
    precipitation_value: {
        color: '#FFF',
        fontSize: 14,
    },
    forecast_container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF',
    },
    forecast_title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    daily_item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    daily_day: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    daily_icon_container: {
        width: 60,
        alignItems: 'center',
    },
    daily_precipitation: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    daily_temp_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    daily_high: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        width: 30,
        textAlign: 'right',
    },
    temp_bar_container: {
        width: 80,
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
        marginHorizontal: 8,
    },
    temp_bar: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
    },
    daily_low: {
        fontSize: 16,
        color: '#666',
        width: 30,
    },
    trending_container: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
    },
    trending_title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    trending_text: {
        fontSize: 16,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#F5F5F5',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    cityName: {
        fontSize: 16,
        color: '#333',
    },
    highlightedCityItem: {
        backgroundColor: '#f0f4ff',
        borderLeftWidth: 3,
        borderLeftColor: '#3949AB',
    },
    highlightedCityName: {
        fontWeight: 'bold',
        color: '#3949AB',
    },
})

export default styles