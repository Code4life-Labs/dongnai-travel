import {
  View, Text,
  Button,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TouchableNativeFeedback,
  Platform,
  Image,
  ImageBackground
} from "react-native"
import React, { useEffect,useState } from "react"
import * as Location from "expo-location"

import { useSelector } from "react-redux"

import {
  getPlacesAPI,
  getWeatherCurrentAPI
} from 'apis/axios'

import { getBlogsAPI } from "apis/axios/blog/get"

import { useBriefPlaces } from "customHooks/usePlace"
import { useTheme } from "customHooks/useTheme"

import { selectCurrentMode } from "redux/theme/ThemeSlice"
import { selectCurrentMap } from "redux/map/mapSlice"
import { selectCurrentLanguage } from "redux/language/LanguageSlice"

import {
  BRIEF_PLACE_DATA_FIELDS,
  BRIEF_BLOG_DATA_FIELDS,
  PLACE_QUALITIES,
  BLOG_QUANLITIES
} from "utilities/constants"
import { weatherImages } from "utilities/mapdata"
import { Ionicons, Entypo,Fontisto,FontAwesome5,MaterialCommunityIcons} from "react-native-vector-icons"

import { withTheme } from "hocs/withTheme"

import { 
  AppText, 
  HorizontalPlaceCard, 
  RectangleButton,
  HorizontalBlogCard,
  TypeScrollView,
  VerticalBlogCardSkeleton,
  VerticalBlogCard,
  VerticalPlaceCard,
  VerticalPlaceCardSkeleton,
  BannerButton
} from "components"
import CustomStatusBar from "components/custom_status_bar/CustomStatusBar"
import TabSlideCategoryPlace from "components/tab_slide_category_place/TabSlideCategoryPlace"
import TabSlideCategoryBlog from "components/tab_slide_category_blog/TabSlideCategoryBlog"
import HomeBannerSlider from "components/home_banner_slider/HomeBannerSlider"

import styles from "./HomeScreenStyles"
import { app_c, app_sp, app_typo } from "globals/styles"

/**
 * @returns 
 */
const HomeScreen = withTheme(({
  navigation,
  theme,
  toggleTheme
}) => {
  const currentMap = useSelector(selectCurrentMap)
  const [showPanelWeather, setShowPanelWeather] = useState(false)
  //template
  const [celsius, setCelsius] = useState(null)
  const [desWeather, setDesWeather] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [cloud, setCloud] = useState(null)
  const [vision, setVision] = useState(null)
  const [wind, setWind] = useState(null)
  const [iconId, setIconId] = useState(null)
  const [typePlace, setTypePlace] = React.useState("all");
  const [typeBlog, setTypeBlog] = React.useState("all");
  const [places, setPlaces] = React.useState(null);
  const [blogs, setBlogs] = React.useState(null);


  //language
  const langCode = useSelector(selectCurrentLanguage).languageCode
  const langData = useSelector(selectCurrentLanguage).data?.homeScreen

  const previousTypes = React.useRef({
    place: typePlace,
    blog: typeBlog
  })

  // console.log('ChoseTypeOfPlace: '+ typePlace)
  // console.log('ChoseTypeOfBlog: '+ typeBlog)
  // const [location,setLocation] = useState(null)  
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  const getCurrentWeather = async (location)=>{
    await getWeatherCurrentAPI(location)
    .then(data => {
      setCelsius(data.main.temp.toFixed(1))
      setHumidity(data.main.humidity)
      setWind(data.wind.speed.toFixed(1))
      setCloud(data.clouds.all)
      setVision(data.visibility / 1000)
      setDesWeather(data.weather[0].description)
      setIconId(data.weather[0].icon)

    })
  }

  // console.log('Theme: ', theme)

  useEffect(()=>{
    if (currentMap.userLocation) {
      getCurrentWeather(currentMap.userLocation)
      // Phương: Hiển thị thằng panelWeather lên
      setShowPanelWeather(true)
    }
    // getCurrentLocationAsync()
  },[currentMap.userLocation])

  useEffect(() => {
    let query = `limit=5&skip=0&filter=quality:${typePlace}&fields=${BRIEF_PLACE_DATA_FIELDS}`;
    getPlacesAPI(query)
      .then(data => {
        setPlaces(data)
      })
  }, [typePlace])

  React.useEffect(() => {
    let query = {
      limit: 5,
      skip: 0,
      filter: `quality:${typeBlog}`,
      fields: BRIEF_BLOG_DATA_FIELDS
    }
    getBlogsAPI(query)
      .then(response => {
        setBlogs(response.data)
      })
  }, [typeBlog]);
  return (
    <ScrollView style={[styles.container,{backgroundColor: theme.background}]} showsVerticalScrollIndicator={false}>
      <View style={[styles.home_content,{}]}>
        <View style={[styles.home_banner, {}]}>
          <HomeBannerSlider/>
        </View>
        {
          showPanelWeather &&
          <TouchableOpacity onPress={() => navigation.navigate("WeatherScreen")} style>
              <View style={styles.home_temperature}>
               <ImageBackground source={require('../../assets/images/weather_forcast/5564526.jpg')}
                resizeMode="cover" 
                style={{flex:1,marginTop:14, }}
                borderRadius={12}
                >
                  <View style={[styles.temperature]}>
                    <View style={styles.temperature_degrees}>
                      {
                        weatherImages.map(image => {
                          if(image.id === iconId)
                          {
                            return  <Image source={image.image} style={styles.temperature_degrees_icon} key={image.id}/>
                          }
                          return null
                        })
                      }
                      {
                        celsius ? (
                          <AppText style={[styles.temperature_degrees_info,{fontSize:22,marginTop:-4,color:theme.primary}]} >{`${celsius}°C`}</AppText>) 
                          : (
                          <AppText style={[styles.temperature_degrees_info,{fontSize:22,marginTop:-4,color:theme.primary}]}><Entypo name="minus"/>
                          <Entypo name="minus"/>{`°C`}</AppText>
                          )
                      }
                      {
                        desWeather ? (
                          <AppText numberOfLines={2}  
                          style={[styles.temperature_degrees_info,{fontSize:14,paddingHorizontal:4,textAlign:"center",color:theme.primary}]}
                          >
                            {capitalizeFirstLetter(desWeather)}
                          </AppText>
                        ) : <AppText numberOfLines={2} style={[styles.temperature_degrees_info,{fontSize:13,paddingHorizontal:4,textAlign:"center",color:theme.primary}]}>
                          {langData.desWeather[langCode]}
                          </AppText>
                      }
                    </View>
                    <View style={styles.temperature_other_info}>
                      <View style={[styles.temperature_other_info_half]}>
                        <View style={styles.temperature_other_info_quarter}>
                          {/* <Fontisto name='wind' size={14} color={theme.ext_secon d}/> */}
                          <AppText style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>Sức gió:</AppText>
                          {
                            wind ?(
                            <AppText numberOfLines={1} style={{...app_typo.fonts.normal.normal.h5,paddingHorizontal:5,color:theme.primary}}>{`${wind}`}
                              <AppText style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>km/h</AppText>
                            </AppText>
                            ) :  <AppText numberOfLines={1} style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>
                                <AppText style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>km/h</AppText>
                            </AppText>
                          }
                        </View>
                        <AppText style={{fontSize:22,color:theme.primary}}> -</AppText>
                        <View style={[styles.temperature_other_info_quarter,{ marginLeft:6,color:theme.primary}]}>
                           <AppText style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>Độ ẩm:</AppText>
                              {
                                humidity ? (
                                  <AppText style={{...app_typo.fonts.normal.normal.h5,paddingHorizontal:5,color:theme.primary}}>{`${humidity}`}
                                    <Text style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}} >%</Text>
                                  </AppText>
                                ) :  <AppText numberOfLines={1} style={{...app_typo.fonts.normal.normal.h5,color:theme.primary }}>
                                  <Text style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>%</Text>
                                  </AppText>
                              }
                        </View>
                      </View>
                      <View style={styles.temperature_other_info_half}>
                        <View style={styles.temperature_other_info_quarter}>
                          {/* <Entypo name='cloud' size={15} color={theme.ext_second}/> */}
                          <AppText style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>Mây:</AppText>
                          {
                            cloud ? (
                              <AppText numberOfLines={1} style={{...app_typo.fonts.normal.normal.h5,paddingHorizontal:5,color:theme.primary}}>{`${cloud}`+`%`}</AppText>
                            ) :  <AppText numberOfLines={1} style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>
                            <Text style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>%</Text>
                            </AppText>
                          }
                        </View>
                        <AppText style={{fontSize:22,color:theme.primary}}> -</AppText>
                        <View style={[styles.temperature_other_info_quarter,{marginLeft:6,color:theme.primary}]}>
                            {/* <MaterialCommunityIcons name='weather-fog' size={15} color={theme.ext_second}/> */}
                            
                          <AppText style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>Tầm nhìn:</AppText>
                            {
                              vision ? (
                                <AppText style={{...app_typo.fonts.normal.normal.h5,paddingHorizontal:5,color:theme.primary}}>{`${vision.toFixed(1)}`}
                                <Text style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>km</Text>
                                </AppText>
                              ) :  <AppText numberOfLines={1} style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>
                                <Text style={{...app_typo.fonts.normal.normal.h5,color:theme.primary}}>km</Text>
                                </AppText>
                            }
                        </View>
                      </View>
                      <View style={[styles.temperature_other_info_half,{width:'100%',justifyContent:'center'}]}>
                            <AppText style={{...app_typo.fonts.normal.normal.h5,color:app_c.HEX.ext_bg_tab}}>Chi tiết dự báo thời tiết</AppText>
                            <Image style={{width:20,height:20,marginLeft:8}} source={require('../../assets/images/weather_forcast/weather-app.png')}/>
                      </View>
                    </View>
                  </View>
               </ImageBackground>
                {/* <TouchableOpacity style={[styles.temperature_reload,{backgroundColor: theme.ext_primary,}]} onPress={getCurrentWeather}>
                  <Ionicons name="reload-sharp" size={30} color={theme.fourth} />
                </TouchableOpacity> */}
              </View>
          </TouchableOpacity>
        }

        {/* Place and Blog*/}
        <View>
          <TouchableOpacity style={styles.category_header} onPress={()=>navigation.navigate("ExploreNavigator")}>
            <AppText style={styles.category_name}>{langData.title_place[langCode]}</AppText>
            <AppText><Entypo name="chevron-small-right" size={40}/></AppText>
          </TouchableOpacity>
          <TypeScrollView
            types={PLACE_QUALITIES[langCode].values}
            labels={PLACE_QUALITIES[langCode].labels}
            callBack={setTypePlace}
            scrollStyle={[app_sp.mb_12, app_sp.ps_18]}
            containerStyle={app_sp.pv_10}
          />
          <ScrollView 
            horizontal={true}
            contentContainerStyle={[{flexGrow: 1}, app_sp.pb_10]}
            showsHorizontalScrollIndicator={false}
          >
            {
              !places
              ? [1, 2, 3, 4, 5].map((value, index) => {
                let actualStyle = [app_sp.me_18];
                if(index === 0) actualStyle.push(app_sp.ms_18);
                return <VerticalPlaceCardSkeleton key={value + index} style={actualStyle} />
              })
              : places.map((place, index) => {
                let actualStyle = [app_sp.me_18];
                if(index === 0) actualStyle.push(app_sp.ms_18);
                return <VerticalPlaceCard place={place} placeIndex={index} typeOfBriefPlace={typePlace} style={actualStyle} key={place.place_id} />
              })
            }
          </ScrollView>
        </View>
        <View style={[{backgroundColor: theme.background}]}>

          <TouchableOpacity style={styles.category_header} onPress={()=>navigation.navigate("BlogsNavigator")}>
            <AppText style={styles.category_name}>{langData.title_Blog[langCode]}</AppText>
            <AppText><Entypo name="chevron-small-right" size={40}/></AppText>
          </TouchableOpacity>
          <TypeScrollView
            types={BLOG_QUANLITIES[langCode].values}
            labels={BLOG_QUANLITIES[langCode].labels}
            callBack={setTypeBlog}
            scrollStyle={[app_sp.mb_12, app_sp.ps_18]}
            containerStyle={[{backgroundColor: theme.background}, app_sp.pv_10]}
          />
          <ScrollView
            horizontal={true}
            style={[{backgroundColor: theme.background}]}
            contentContainerStyle={[{flexGrow: 1}, app_sp.pb_10,]}
            showsHorizontalScrollIndicator={false}
          >
            {
              !blogs
              ? [1, 2, 3, 4, 5].map((value, index) => <VerticalBlogCardSkeleton key={value + index} style={{ marginLeft: index === 0 ? 16 : 0, marginRight: 16}} />)
              : blogs.map((blog, index) => {
                let actualStyle = [app_sp.me_18];
                if(index === 0) actualStyle.push(app_sp.ms_18);
                return <VerticalBlogCard blog={blog} blogIndex={index} typeOfBriefBlog={typeBlog} style={actualStyle} key={blog._id}  />
              }
              )
            }
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  )
})



export default HomeScreen
