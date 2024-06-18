import {
  View,
  Text,
  Pressable,
  Animated,
  Image
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import {
  ScrollView,
  FlatList
} from 'react-native-gesture-handler';

import {
  getPlaceDetailsWithPipelineAPI,
  getPlacesAPI
} from 'apis/axios'

import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { selectCurrentLanguage } from 'redux/language/LanguageSlice'

// import useTheme from 'customHooks/useTheme'
import {
  usePlaceDetailsState,
  usePlaceDetailsActions,
  usePlaceDetails,
  usePlaceInteractionActions,
  useBriefPlacesActions
} from 'customHooks/usePlace'
import {
  useAudio
} from 'customHooks/useAudio'

import StringUtility from 'utilities/string'
import {
  HEADER_HEIGHT,
  PLACE_DETAILS_DATA_FIELDS,
  BRIEF_PLACE_DATA_FIELDS
} from 'utilities/constants'

import BottomSheet, { BottomSheetView, BottomSheetScrollView, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet'

import { Foundation, Entypo, Fontisto, FontAwesome5, FontAwesome, MaterialIcons, MaterialCommunityIcons, Ionicons, Octicons} from "react-native-vector-icons"

import {
  AppText,
  MyFadeAnimatedView,
  MyHeader,
  RectangleButton,
  CircleButton,
  AppTabSlider,
  SimpleBarChart,
  MarkFormat,
  HorizontalPlaceCard,
  HorizontalPlaceCardSkeleton,
  ReviewSectionPromise,
  Speech
} from 'components'

import styles from './ItineraryDetailScreenStyles'
import { app_c, app_dms, app_sp, app_typo } from 'globals/styles'

import {
  PlaceDetailsDataProps
} from 'types/index.d.ts'
import Lightbox from 'react-native-lightbox-v2';
import ButtonInText from 'components/button_in_text/ButtonInText';
import { socketIoInstance } from '../../../App';
import { selectCurrentItinerary } from 'redux/itinerary/ItinerarySlice';
import HomeBannerSlider from 'components/home_banner_slider/HomeBannerSlider';
import Swiper from 'react-native-swiper';
import ImagePromise from 'components/image_promise/ImagePromise';
import { selectCurrentManifold, updateNotif } from 'redux/manifold/ManifoldSlice';

/**
 * __Creator__: @FSN coppy from @NguyenAnhTuan1912
 * @returns 
 */
const ItineraryDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const itinerary = useSelector(selectCurrentItinerary)
  const map_api_key = useSelector(selectCurrentManifold).privateKeys?.map_api_key
  const dispatch = useDispatch()

  //theme
  // const themeColor = useTheme();


  const [selectTabIndex, setSelectTabIndex] = useState(0)
  const [photoReferences, setPhotoReferences] = useState([])
  const [namePlaces, setNamePlaces] = useState([])

  const swiper = useRef(null)
 
  useEffect(() => {
    const dataSlice = itinerary?.dataDay[selectTabIndex]
    console.log("🚀 ~ file: ItineraryDetailScreen.jsx:99 ~ useEffect ~ dataSlice:", dataSlice)
    if (typeof dataSlice === 'object') {
      // const data = {"afternoon": "Tham quan [Đồi Con Heo], một điểm đến phổ biến với tượng đài con heo và tầm nhìn đẹp ra biển.", "evening": "Thưởng thức một bữa tối ngon tại [Nhà hàng Ngọc Dung], nơi bạn có thể thưởng thức các món hải sản tươi sống.", "morning": "Tham quan [Hải Đăng Vũng Tàu], một biểu tượng nổi tiếng của thành phố. Bạn có thể leo lên đỉnh hải đăng để ngắm toàn cảnh Vũng Tàu từ trên cao.", "noon": "Ăn trưa tại [Nhà hàng Cây Bàng], nơi bạn có thể thưởng thức các món ăn đặc sản miền Trung.", "numberOfDay": 2}
      console.log('trc regrex')
      const regex = /\[(.*?)\]/g
      console.log('sau regrex')

      const namePlacesRaw = [...(dataSlice?.morning.match(regex) || []), ...(dataSlice?.noon.match(regex) || []), ...(dataSlice?.afternoon.match(regex) || []), ...(dataSlice?.evening.match(regex) || [])]
      console.log("🚀 ~ file: ItineraryDetailScreen.jsx:106 ~ useEffect ~ namePlacesRaw:", namePlacesRaw)
      const namePlaces = namePlacesRaw.map(i => i.slice(1, -1))
      console.log("🚀 ~ file: ItineraryDetailScreen.jsx:106 ~ useEffect ~ namePlaces:", namePlaces)
      setNamePlaces(namePlaces)

      const photoReferences = []
      const dataPlaces = [...(route.params?.dataFnbPlaces || []), ...(route.params?.dataTravelPlaces || [])]

      if (dataPlaces.length > 0) {
        namePlaces.map(name => {
          const existPlace = dataPlaces.find(i => name === i.name)
          if (existPlace)
          photoReferences.push(existPlace?.photos[0].photo_reference) 
        })
      }
      console.log('photoReferences', photoReferences)
      // const dataPlaces = route.params?.dataPlaces
      // if (dataPlaces) {
      //   if (dataPlaces.length > 0) {
      //     namePlaces.map(name => {
      //       const existPlace = dataPlaces.find(i => name === i.name)
      //       if (existPlace)
      //       photoReferences.push(existPlace?.photos) 
      //     })
      //   }
      // }
      // console.log("🚀 ~ file: ItineraryDetailScreen.jsx:134 ~ useEffect ~ photoReferences:", photoReferences.length)
      setPhotoReferences(prev => photoReferences)
    }
  }, [selectTabIndex, itinerary?.dataDay[selectTabIndex]])
  

  const snapPoints = React.useMemo(
    () => ['70%', `${100- (30 / app_dms.screenHeight) * 100}%`], []
  );
    
  const bottomSheetRef = React.useRef(null);
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  const animFade = React.useCallback((toValue) => {
    Animated.timing(
      opacityValue,
      {
        toValue: toValue,
        duration: 200,
        useNativeDriver: true
      }
    ).start();
  }, [opacityValue]);

  const handleChangeBottomSheet = index => {
    if(index === 1) {
      animFade(1);
    } else {
      animFade(0);
    }
  }


  const handlePressPlaceName = (placeName) => {
    console.log("🚀 ~ file: ItineraryDetailScreen.jsx:167 ~ handlePressPlaceName ~ placeName:", placeName)
    const placeToNavigate = route.params?.dataTravelPlaces.find(i => i.name === placeName) ?? route.params?.dataFnbPlaces.find(i => i.name === placeName)
    if (placeToNavigate)
      navigation.navigate('MapFullScreen', {
        place_id: placeToNavigate.place_id,
        fromScreen: 'ChatBotScreen',
        isFullScreen: true
      })
    else 
      dispatch(updateNotif({
        appearNotificationBottomSheet: true,
        contentNotificationBottomSheet: `Không thể tìm thấy "${placeName}"`
      }))
    // swiper?.scrollBy(index, true)
  }

  return (
    <View style={{backgroundColor: 'white', flex: 1, paddingTop: 30,}}>
      {/* <Animated.View
        style={{
          opacity: opacityValue,
          backgroundColor: themeColor.primary,
          height: HEADER_HEIGHT,
          zIndex: 999
        }}
      /> */}
        {/* <Image
          source={presentationImageUrl ? {uri: presentationImageUrl} : {}}
          style={styles.pd_background_image}
        /> */}

        {/* <View style={styles.pd_background_image}>
          <Swiper
            ref={swiper}
            // onMomentumScrollEnd={(e, state, context) => {
            //   console.log("🚀 ~ file: ItineraryDetailScreen.jsx:242 ~ ItineraryDetailScreen ~ context:", context)
            //   console.log("🚀 ~ file: ItineraryDetailScreen.jsx:242 ~ ItineraryDetailScreen ~ state:", state)
            //   console.log("🚀 ~ file: ItineraryDetailScreen.jsx:242 ~ ItineraryDetailScreen ~ e:", e)
            // }}
            loop
            dot={
              <View
                style={styles.dot}
              />
            }
            activeDot={
              <View
                style={styles.active_dot}
              />
            }
            paginationStyle={{
              bottom: 0.05 * app_dms.screenHeight + 30,
            }}
          >
              {
                (photoReferences.length > 0) &&
                photoReferences.map((photo, index)=>{
                  return(
                  <View key={photo} style={styles.slide}>
                    <ImagePromise
                      fromDetailItinerary={true}
                      isTranformData={true}
                      photoReference={photo}
                      style={styles.image}
                      map_api_key={map_api_key}
                    />
                  </View>
                  )
                })
              }
          </Swiper>
        </View>
      <BottomSheet
        snapPoints={snapPoints}
        index={0}
        ref={bottomSheetRef}
        style={styles.pd_bottom_sheet}
        onChange={handleChangeBottomSheet}
        backgroundStyle={{
          flex: 1,
          backgroundColor: themeColor.primary
        }}
      >
        <BottomSheetScrollView
          style={[styles.pd_bottom_sheet_view, { backgroundColor: themeColor.primary }]}
          showsVerticalScrollIndicator={false}
        >
          
        </BottomSheetScrollView>
      </BottomSheet> */}
      <View style={[styles.pd_header, app_sp.ph_18, { borderBottomColor: app_c.HEX.fourth }]}>
          
            {/* Information row */}
            <View style={{...styles.pd_row, ...app_sp.mb_12}}>

              {/* Name, location of visits column */}
              <View style={[{flex: 1}, app_sp.me_12]}>
                <AppText font="h2" numberOfLines={2}>{`Lịch trình ${route.params?.numberDayToTravel.length} ngày đi ${route.params?.placeToTravel}`}</AppText>
                <Text 
                  style={{
                    marginTop: 10,
                    color: app_c.HEX.fourth,
                    ...app_typo.fonts.normal.normal.body1,
                    width: '100%',
                    textAlign: 'justify',
                    lineHeight: 18
                  }}
                >
                  {/* {itinerary?.textIntroduce ? itinerary?.textIntroduce : route.params?.textIntroduce} */}
                  {itinerary?.textIntroduce}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Day slide */}
          <AppTabSlider
            selectTabIndex={(index) => {
              console.log("🚀 ~ file: ItineraryDetailScreen.jsx:254 ~ ItineraryDetailScreen ~ index:", index)
              setSelectTabIndex(index)
            }}
          >
            {
              route.params?.numberDayToTravel &&
              route.params?.numberDayToTravel.map((i, index) => {
                return (
                  <AppTabSlider.Child
                    key={i}
                    name={'Ngày ' + i}
                    component={() => 
                      <DaySlide 
                        index={index} 
                        handlePressPlaceName={(placeName) => handlePressPlaceName(placeName)}
                      />
                    }
                  />
                  )
                })
              }
          </AppTabSlider>
          
            <Text 
              style={{
                marginTop: 10,
                color: app_c.HEX.fourth,
                ...app_typo.fonts.normal.normal.body1,
                width: '100%',
                paddingHorizontal: 16,
                textAlign: 'justify',
                lineHeight: 18
              }}
            >
              {/* {itinerary?.textEnding ? itinerary?.textEnding : route.params?.textEnding} */}
              {itinerary?.textEnding}
            </Text>

          <View style={{height: 125}}></View>
    </View>
  )
}

const DaySlide = ({ index, handlePressPlaceName }) => {
  const itinerary = useSelector(selectCurrentItinerary)
  const dataSlice = itinerary?.dataDay[index]
  console.log("🚀 ~ file: ItineraryDetailScreen.jsx:294 ~ DaySlide ~ dataSlice:", dataSlice)

  return (
    <View style={styles.pd_content_container}>
      <View style={{
        paddingRight: 45
      }}>
        {
          dataSlice?.morning &&
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
          }}>
            <Image
              source={require('../../assets/images/morning.jpg')}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                marginRight: 10,
                marginTop: 5
              }}
            />
            <ButtonInText 
              isItineraryDetail={true}
              numberOfLines={null} 
              textRaw={'Buổi sáng: ' + dataSlice?.morning} 
              handlePressPlace={(placeName) => handlePressPlaceName(placeName)}
            />
          </View>
        }

        {
          dataSlice?.noon &&
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
          }}>
            <Image
              source={require('../../assets/images/noon.jpg')}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                marginRight: 10,
                marginTop: 5
              }}
            />
            <ButtonInText 
              isItineraryDetail={true}
              numberOfLines={null} 
              textRaw={'Buổi trưa: ' + dataSlice?.noon} 
              handlePressPlace={(placeName) => handlePressPlaceName(placeName)}
            />
          </View>
        }

        {
          dataSlice?.afternoon &&
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
          }}>
            <Image
              source={require('../../assets/images/afternoon.jpg')}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                marginRight: 10,
                marginTop: 5
              }}
            />
            <ButtonInText 
              isItineraryDetail={true}
              numberOfLines={null} 
              textRaw={'Buổi chiều: ' + dataSlice?.afternoon} 
              handlePressPlace={(placeName) => handlePressPlaceName(placeName)}
            />
          </View>
        }

        {
          dataSlice?.evening &&
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 5,
          }}>
            <Image
              source={require('../../assets/images/evening.jpg')}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                marginRight: 10,
                marginTop: 5
              }}
            />
              <ButtonInText 
                isItineraryDetail={true}
                numberOfLines={null} 
                textRaw={'Buổi tối: ' + dataSlice?.evening} 
              handlePressPlace={(placeName) => handlePressPlaceName(placeName)}
              />
          </View>
        }
      </View>
    </View>
  );
}

export default ItineraryDetailScreen