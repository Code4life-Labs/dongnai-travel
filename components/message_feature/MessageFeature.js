import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Image, Platform, ActivityIndicator } from 'react-native'
import React, { Component, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import styles from './ChatBotScreenStyles'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentLanguage } from '../../redux/language/LanguageSlice'
// import useTheme from 'customHooks/useTheme'
import { getMorePlacesTextSearchAPI, getPlacesTextSearchAPI, getPlacesTextSearchAPIWithoutLoading, getRouteDirectionAPI, getRouteDirectionAPIWithoutLoading, getTextChatBotAPI } from 'apis/axios'
import { selectCurrentUser } from 'redux/user/UserSlice'
import { selectTemporaryUserId } from 'redux/user/UserSlice'
import { app_c, app_dms, app_sh, app_shdw, app_sp, app_typo } from 'globals/styles';
import { selectCurrentMap } from 'redux/map/mapSlice'

import { AppText, VerticalPlaceCard, VerticalPlaceCardSkeleton } from 'components';

import { GiftedChat, Bubble, InputToolbar, Actions, Composer, Send } from 'react-native-gifted-chat'

import { getPlacesAPI } from 'apis/axios';
import { weatherIcons } from 'utilities/mapdata';
import WeatherChart from 'libs/react-native-weather-chart';
import { Foundation, Entypo, Fontisto, FontAwesome5, FontAwesome, MaterialIcons, MaterialCommunityIcons, Ionicons, Octicons} from "react-native-vector-icons"
import moment from 'moment/moment'

import { BRIEF_PLACE_DATA_FIELDS } from 'utilities/constants';
import { WebView } from 'react-native-webview';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { styles } from './MessageFeatureStyles'
import StarRating from 'components/star_rating/StarRating'
import ImagePromise from 'components/image_promise/ImagePromise'
import { useNavigation } from '@react-navigation/native'
import { Animated } from 'react-native'
import { debounce } from 'lodash'
import { PolyLineDirection } from 'components/polyline_direction/PolyLineDirection'
import InputAutoComplete from 'components/input_auto_complete/InputAutoComplete'
import { selectCurrentManifold, updateNotif } from 'redux/manifold/ManifoldSlice'
import { socketIoInstance } from '../../../App'
import FunctionsUtility from 'utilities/functions'
import ButtonInText from 'components/button_in_text/ButtonInText'
import Skeleton from 'components/skeleton/Skeleton'
import { selectCurrentItinerary, updateCurrentItinerary } from 'redux/itinerary/ItinerarySlice'

/**
 * @author FSN
 * @description Đây là component để hiển thị các tính năng như: hiển thị biểu đồ thời tiết, bản đồ, đường đi, etc,.. 
 * @param {string} action là hành động để phân biệt các TH (ví dụ: input.get-weather->lấy các dữ liệu về thời tiết) 
 * @param {object} data là các dữ liệu để phục vụ hiển thị khi đã tổng hợp từ BE
 * @returns {Component}
 */
const MessageFeature = ({action, data = {}}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  // ====================================input.suggest-place==========================
  const [places, setPlaces] = useState(null);
  const [typePlace] = useState("all");

  // const themeColor = useTheme();

  // ====================================input.get-weather==========================
  const [weatherHourSelectedIndex, setWeatherHourSelectedIndex] = useState(0)
  const [weatherDataSelected, setWeatherDataSelected] = useState({})

  // ====================================input.location-on-map==========================

  const ASPECT_RATIO = app_dms.screenWidth / app_dms.screenHeight
  const LATITUDE_DELTA = 0.3
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
  const INITIAL_POSITION = {
    latitude: 10.9160571,
    longitude: 106.8323861,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }

  const CARD_HEIGHT = 120
  const CARD_WIDTH = 300 * 0.8
  const SPACING_FOR_CARD_INSET = 300 * 0.1 - 10

  
  const [placesTextSearch, setPlacesTextSearch] = useState([])
  const [arrPlaceToFitCoor, setArrPlaceToFitCoor] = useState([])

  const [mapType, setMapType] = useState('standard')

  const [nextPageToken, setNextPageToken] = useState(null)
  const [isShowRefreshCard, setIsShowRefreshCard] = useState(false)
  const mapRef = useRef(null)
  const cardScrollViewRef = useRef(null)
  
  const [isModeScrollOn, setIsModeScrollOn] = useState(false)
  const [isShowLoading, setIsShowLoading] = useState(true)
  const [isShowLoading1, setIsShowLoading1] = useState(true)
  

  const loadMoreCardDebouncer = useMemo(() => debounce(
    () => { handleLoadingMoreCard()}, 500),
    [handleLoadingMoreCard, nextPageToken, placesTextSearch], 
  )

  const [mapIndex, setMapIndex] = useState(0)
  let loadingRefreshCard = false
  // eslint-disable-next-line prefer-const
  let mapAnimation = new Animated.Value(-27.3333)

  const handleLoadingMoreCard = () => {
    console.log("Loading more")
    if (nextPageToken && !loadingRefreshCard) {
      loadingRefreshCard = true
      let dataToCallApi = {
        ...data,
        pagetoken: nextPageToken
      }
  
      getMorePlacesTextSearchAPI(dataToCallApi).then((dataReturn) => {
        console.log("duwx lieeuj trar về")
  
        if (dataReturn.nextPageToken){
          console.log("Có nextPageToken")
          setNextPageToken(dataReturn.nextPageToken)
        } else {
          console.log(" k Có nextPageToken")
          setNextPageToken(null)
        }

        if (dataReturn.arrPlace) {
          setPlacesTextSearch([
            ...placesTextSearch,
            ...dataReturn.arrPlace
          ])
          console.log("Có dataReturn.arrPlace")
        } else {
          console.log("K Có dataReturn.arrPlace")
        }
        setIsShowRefreshCard(false)
        loadingRefreshCard = false
      }).catch(err => {
        setIsShowRefreshCard(false)
        loadingRefreshCard = false
      })

    } else {
      setIsShowRefreshCard(false)
      loadingRefreshCard = false
      // toast.show("There's nowhere to load more!")
    }
  }
  
  useEffect(() => {
    if (placesTextSearch) {
      mapAnimation.addListener(({ value }) => {
        // // console.log("🚀 ~ file: MapScreen.jsx:279 ~ mapAnimation.addListener ~ value:", value)
        // animate 30% away from landing on the next item
        let index = Math.floor((value / (CARD_WIDTH + 20)) + 0.3)
  
        if (value >= (placesTextSearch.length - 1) * (300*0.8 + 20) && !loadingRefreshCard) {
          setIsShowRefreshCard(true)
          loadMoreCardDebouncer()
        }
        

        if (index >= placesTextSearch.length) {
          index = placesTextSearch.length - 1
          // tại đây loading more 
        }
        if (index <= 0) {
          index = 0
        }
  
        clearTimeout(regionTimeout)
        const regionTimeout = setTimeout(() => {
          if (mapIndex !== index) {
            setMapIndex(index)
            const coordinate = {
              latitude: placesTextSearch[index].geometry.location.lat,
              longitude: placesTextSearch[index].geometry.location.lng,
            }
            
            setIsModeScrollOn(true)
            moveToMap(coordinate, 16, 90)
          }
        }, 350)
      })
    }
  })

  // useEffect(() => {
  //   if (isShowScrollCardPlace)
  //     cardScrollViewRef.current.scrollTo({ x: -27.3333, y: 0, animated: true })
  // }, [isShowScrollCardPlace])

  useEffect(() => {
    return () => {
      loadMoreCardDebouncer.cancel()
    }
  }, [])
  // ====================================input.direction-a-to-b==========================
  const map_api_key = useSelector(selectCurrentManifold).privateKeys?.map_api_key
  const currentMap = useSelector(selectCurrentMap)

  const oriInputRef = useRef(null)
  const desInputRef = useRef(null)

  const [oriRouteInfo, setOriRouteInfo] = useState(null)
  const [desRouteInfo, setDesRouteInfo] = useState(null)

  const [isFocusedOriInput, setIsFocusedOriInput] = useState(false)
  const [isFocusedDesInput, setIsFocusedDesInput] = useState(false)

  const calloutRef0 = useRef(null)
  const calloutRef1 = useRef(null)
  const calloutRef2 = useRef(null)

  const [directionsPolyLine, setDirectionsPolyLine] = useState([])
  const [selectedPolyLine, setSelectedPolyLine] = useState(0)

  const [textOrigin, setTextOrigin] = useState('')
  const [textDestination, setTextDestination] = useState('')

  const [directionOriPlaceId, setDirectionOriPlaceId] = useState(null)
  const [directionDesPlaceId, setDirectionDesPlaceId] = useState(null)

  const [dataTime, setDataTime] = useState({})
  const [distance, setDistance] = useState(0)

  const handleDatetimeAndDistance = (distance, duration) => {
    setDistance((distance / 1000).toFixed(2)) // ~ km
    const secondsTranformYet = duration // ~ second

    const days = Math.floor(secondsTranformYet / 86400)
    const hours =  Math.floor((secondsTranformYet - (days * 86400)) / 3600)
    const minutes = Math.floor((secondsTranformYet - (days * 86400) - (hours * 3600)) / 60)
    const seconds = Math.floor((secondsTranformYet - (days * 86400) - (hours * 3600) - (minutes* 60)))

    setDataTime({
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    })
  }
  // ====================================input.where-am-i==========================
  const [myLocation, setMyLocation] = useState(currentMap.userLocation)

  // ====================================input.travel-itinerary==========================

  const itinerary = useSelector(selectCurrentItinerary)
  const user = useSelector(selectCurrentUser)
  const temporaryUserId = useSelector(selectTemporaryUserId)

  
  const [textEnding, setTextEnding] = useState('')
  // const [textEnding, setTextEnding] = useState('Trên đây là kế hoạch chi tiết cho chuyến đi của bạn đến Hà Giang trong 5 ngày. Bạn có thể điều chỉnh kế hoạch này để phù hợp với sở thích và ngân sách của bạn. Chúc bạn có một chuyến đi thú vị và trọn vẹn tại Hà Giang!')
  const [textIntroduce, setTextIntroduce] = useState('')
  // const [textIntroduce, setTextIntroduce] = useState('Dưới đây là một kế hoạch chi tiết cho chuyến đi 5 ngày của bạn đến Hà Giang:')
  const fakeDatData = [{"afternoon": "Tham quan [Đồn Pháp đỉnh núi Cấm], một di tích lịch sử quan trọng với kiến trúc Pháp cổ điển và tầm nhìn tuyệt đẹp ra cảnh quan xung quanh.", "evening": "Dạo chơi tại [Quán ăn ngon], nơi bạn có thể thưởng thức các món ăn địa phương ngon và rẻ.", "morning": "Từ thành phố Hà Nội, bạn có thể di chuyển đến Hà Giang bằng xe buýt hoặc xe máy. Đến Hà Giang, bạn có thể nhận phòng tại khách sạn của bạn.", "noon": "Thưởng thức một bữa trưa ngon tại [Nhà hàng Cơm Dân Tộc], nơi bạn có thể thưởng thức các món ăn đặc sản của vùng miền.", "numberOfDay": 1}, {"afternoon": "Tham quan [Cây Trái Tim Hà Giang], một điểm đến lãng mạn với cây cỏ hình trái tim và không gian yên bình.", "evening": "Thưởng thức một bữa tối ngon tại [Quán Ăn A Giang], nơi bạn có thể thưởng thức các món ăn đặc sản miền núi.", "morning": "Tham quan [Lung Khuy Cave], một hang động nổi tiếng với kiến trúc độc đáo và hệ thống đèn chiếu sáng tạo nên không gian ma mị.", "noon": "Ăn trưa tại [Nhà hàng Đà điểu Hà Giang], nơi bạn có thể thưởng thức các món ăn đặc sản từ đà điểu.", "numberOfDay": 2}, {"afternoon": "Tham quan [Ahatrip Hà Giang], một điểm đến phổ biến với cảnh quan đẹp và hoạt động thể thao mạo hiểm như leo núi, trượt nước và đạp xe địa hình.", "evening": "Dạo chơi tại [Quán ăn], nơi bạn có thể thưởng thức các món ăn địa phương ngon và rẻ.", "morning": "Tham quan [Nà Thác Palms], một khu rừng nguyên sinh nổi tiếng với cây cổ thụ và thác nước tuyệt đẹp.", "noon": "Ăn trưa tại [Quán ăn vặt], nơi bạn có thể thưởng thức các món ăn vặt địa phương.", "numberOfDay": 3}, {"afternoon": "Tham quan [Cổng Trời Quản Bạ], một cổng trời nổi tiếng với kiến trúc độc đáo và tầm nhìn tuyệt đẹp ra cảnh quan xung quanh.", "evening": "Thưởng thức một bữa tối ngon tại [Nhà Hàng Sông Núi], nơi bạn có thể thưởng thức các món ăn đặc sản miền núi.", "morning": "Tham quan [Núi đôi Quản Bạ], một ngọn núi nổi tiếng với cảnh quan đẹp và đường mòn leo núi thú vị.", "noon": "Ăn trưa tại [Nhà hàng ngỗng K9 Hà Giang], nơi bạn có thể thưởng thức các món ăn đặc sản từ ngỗng.", "numberOfDay": 4}, {"afternoon": "Tham quan [Chiêu Lầu Thi], một ngôi đền thờ nổi tiếng với kiến trúc độc đáo và không gian yên bình.", "evening": "Thưởng thức một bữa tối ngon tại [Nhà Hàng Sơn Thúy], nơi bạn có thể thưởng thức các món ăn đặc sản miền núi.", "morning": "Tham quan [Ruộng Bậc Thang Hoàng Su Phì], một khu ruộng bậc thang nổi tiếng với cảnh quan đẹp và màu sắc đa dạng của lúa.", "noon": "Ăn trưa tại [Nhà Hàng Cơm Dân Tộc], nơi bạn có thể thưởng thức các món ăn đặc sản của vùng miền.", "numberOfDay": 5}] 
  const [dataDay, setDataDay] = useState([])
  const [numberDay, setNumberDay] = useState(prev => {
    if (data?.numberDayToTravel) {
      const array = []
      for (let index = 1; index <= data.numberDayToTravel; index++) {
        array.push(index)
      }
      return array
    } else {
      return [1, 2]
    }
  })
  const [numberDayToTravel, setNumberDayToTravel] = useState(prev => {
    if (data?.numberDayToTravel) {
      const array = []
      for (let index = 1; index <= data.numberDayToTravel; index++) {
        array.push(index)
      }
      return array
    } else {
      return [1, 2]
    }
  })
  
  // ====================================chung==========================
  useEffect(() => {
    if (action === 'input.suggest-place') {
        let query = `limit=5&skip=0&filter=quality:${typePlace}&fields=${BRIEF_PLACE_DATA_FIELDS}`;
        getPlacesAPI(query)
        .then(data => {
            setPlaces(data)
        })
    } else if (action === 'input.get-weather') {
        const weatherData = data
        setWeatherDataSelected({
            icon: weatherIcons[weatherData.weatherCurrent.weather[0].icon],
            temp: `${weatherData.weatherCurrent.main.temp.toFixed(1)}°C`,
            description: weatherData.weatherCurrent.weather[0].description,
            address: weatherData.nameGeocoding,
            wind: `${weatherData.weatherCurrent.wind.speed.toFixed(1)}km/h`,
            humidity: `${weatherData.weatherCurrent.main.humidity}%`,
            clouds: `${weatherData.weatherCurrent.clouds.all}%`,
            visibility: `${(weatherData.weatherCurrent.visibility/1000).toFixed(1)}km`,
            temp_min: `${weatherData.weatherCurrent.main.temp_min.toFixed(1)}°C`,
            temp_max: `${weatherData.weatherCurrent.main.temp_max.toFixed(1)}°C`,
        })
    } else if (action === 'input.location-on-map') {
      // data: {
      //   question: data.question,
      //   sortBy: 'DEFAULT',
      //   radius: '5000',
      //   location: data.coor
      // }

      // gọi api placeTextSearch
      getPlacesTextSearchAPIWithoutLoading(data).then((dataReturn) => {
        if (dataReturn.nextPageToken) {
          console.log("Có nextPageToken", dataReturn.nextPageToken)
          setNextPageToken(dataReturn.nextPageToken)
        }
        else {
          console.log("K Có nextPageToken")
          setNextPageToken(null)
        }

        if (dataReturn.arrPlace) {
          //  tổng hợp các arrPlace
          let arrPlace = []
          dataReturn.arrPlace.map(place => {
            const placeObj = {
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }
            arrPlace.push(placeObj)
          })

          const edgePadding = {
            top: 0,
            right: 0,
            bottom: 100,
            left: 0
          }

          console.log("🚀 ~ file: MessageFeature.js:91 ~ useEffect ~ arrPlace:", arrPlace)
          
          setPlacesTextSearch(dataReturn.arrPlace)

          handleFitCoors(arrPlace, edgePadding, true)
          setArrPlaceToFitCoor(arrPlace)

          setIsShowLoading(false)
        } else {
          // Hiển thị thông báo không có kết quả vào qua chatbot
        }
      })
    } else if (action === 'input.direction-a-to-b') {
      console.log('data', data)
      // data: {
      //   oriAddress: string,
      //   desAddress: string,
      //   oriPlaceId: null,
      //   desPlaceId: null,
      //   oriCoor: null,
      //   desCoor: null,
      //   modeORS: 'driving-car',
      //   modeGCP: 'DRIVE',
      //   typeOri: 'address',
      //   typeDes: 'address',
      //   routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
      //   languageCode: 'vi'
      // }
      data.isCallFromChatBot = true
      // gọi api direction
      console.log('isShowLoading1', isShowLoading1)
      getRouteDirectionAPIWithoutLoading(data).then(dataReturn => {
        console.log("🚀 ~ file: MessageFeature.js:300 ~ getRouteDirectionAPIWithoutLoading ~ dataReturn:", dataReturn)
        if (dataReturn?.error) {
          // thông báo qua chat bot là tuyến fường không được hỗ trợ
        } else {
          // setDirectionModeGCP(modeGCP)
          // setDirectionModeORS(modeORS)
          // setTagModeSelected(tagModeId)
          if (dataReturn.callFrom === 'GCP') {

            setOriRouteInfo(dataReturn.oriRouteInfo)
            setDesRouteInfo(dataReturn.desRouteInfo)

            setDirectionOriPlaceId(dataReturn.oriPlaceId)
            setDirectionDesPlaceId(dataReturn.desPlaceId)

            setTextOrigin('điểm khỏi đầu')
            setTextDestination('điểm kết thúc')
            
            const edgePadding = {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
            }
            
            setDirectionsPolyLine(dataReturn.data?.routes)
            setSelectedPolyLine(0)
            // Cho nó focus vào 
            
            setArrPlaceToFitCoor(dataReturn?.data?.routes[0]?.polyline)
            handleFitCoors(dataReturn?.data?.routes[0]?.polyline, edgePadding, true)
            // Hiển thị ngày giờ và khoảng cách
            handleDatetimeAndDistance(dataReturn?.data?.routes[0]?.distanceMeters, dataReturn?.data?.routes[0]?.staticDuration)
          }
        }
      })
      // stop loading 
      setTimeout(() => {
        setIsShowLoading1(prev => false)
      }, 1000);
    } else if (action === 'input.where-am-i') {
      moveToMap(myLocation, 14, 0)
    } else if (action === 'input.travel-itinerary') {
      console.log('data', data)
      if (textIntroduce === '' && textEnding==='' && dataDay.length === 0) {
        console.log('Listen and emit event create_travel_itinerary')
      
        socketIoInstance.on('s_create_travel_itinerary', (dataReturn) => {
          handleListenCreateTravelItinerary(dataReturn)
        })
  
        socketIoInstance.emit('c_create_travel_itinerary', {
          question: data.question,
          travelPlaces: data.travelPlaces,
          fnbPlaces: data.fnbPlaces,
          currentUserId: user?._id ? user._id : temporaryUserId,
        })
      }
    }
}, [])


useEffect(() => {
  dispatch(updateCurrentItinerary({
    textEnding,
    textIntroduce,
    dataDay
  }))
}, [textEnding, textIntroduce, dataDay.length])

const handleListenCreateTravelItinerary= (dataReturn) => {
  let messageFull = ''
  if (dataReturn.isOver && dataReturn.isOver === 'DONE') {
    // messageFull += dataReturn.messageReturn 
    // console.log("🚀 ~ file: MessageFeature.js:391 ~ socketIoInstance.on ~ dataReturn.messageReturn:", dataReturn.messageReturn)
    
    const result = []

    // phân tách từng đoạn một ra
    const paragraphArray = dataReturn.allText.split('\n\n')

    if (paragraphArray.length > 0) {

      // console.log('🚀 ~ file: chatbot.service.js:336 ~ testChatGPT ~ paragraphArray:', paragraphArray)
      // lấy ra được đoaạn đầu và đoạn cuối (Mở đầu và kết thúc)
      setTextIntroduce(prev => paragraphArray[0].trim()) 
      // dispatch(updateCurrentItinerary({
      //   dataDay,
      //   textIntroduce: paragraphArray[0].trim(),
      //   textEnding
      // }))
      // Xóa phần tử đàu của mảng
      paragraphArray.shift()

      // có một lưu ý nhỏ, khi streaming chắc chắn sẽ chưa có đoạn cuối ngay được nên phải check với isDoneTreaming
      setTextEnding(prev => paragraphArray[paragraphArray.length - 1].trim())
      // dispatch(updateCurrentItinerary({
      //   textIntroduce,
      //   textEnding: paragraphArray[paragraphArray.length - 1].trim(),
      //   dataDay
      // }))

      // xóa phần tử cuối của mảng
      paragraphArray.pop()

      if (paragraphArray.length > 0) {
        paragraphArray.map((paragraph, index) => {
          // phân ra từ "\n" và xóa thằng đàu tiền của mảng
          const originalDay = paragraph.split('\n')
          originalDay.shift()
          // console.log('🚀 ~ file: chatbot.service.js:347 ~ paragraphArray.map ~ originalDay:', originalDay)
          const dataDay = {
            numberOfDay: index + 1,
            morning: originalDay[0].replace('- Sáng:', '').trim() ?? originalDay[0].replace('Sáng:', '').trim(),
            noon: originalDay[1].replace('- Trưa:', '').trim() ?? originalDay[1].replace('Trưa:', '').trim(),
            afternoon: originalDay[2].replace('- Chiều:', '').trim() ?? originalDay[2].replace('Chiều:', '').trim(),
            evening: originalDay[3].replace('- Tối:', '').trim() ?? originalDay[3].replace('Tối:', '').trim()
          }
          result.push(dataDay)
        })
      }
      setDataDay(prev => result)
      // dispatch(updateCurrentItinerary({
      //   textEnding,
      //   textIntroduce,
      //   dataDay: paragraphArray[0].trim()
      // }))
      console.log("🚀 ~ file: MessageFeature.js:463 ~ handleListenCreateTravelItinerary ~ result:", result)
      setNumberDayToTravel(prev => {
        const array = []
        for (let index = 1; index <= numberDayToTravel.length - result.length; index++) {
          array.push(index)
        }
        return array
      })
    }

    socketIoInstance.removeAllListeners('s_create_travel_itinerary')
  } else {
    // messageFull += dataReturn.messageReturn 
    // console.log("🚀 ~ file: MessageFeature.js:391 ~ socketIoInstance.on ~ dataReturn.messageReturn:", dataReturn.messageReturn)
    
    const result = []

    // phân tách từng đoạn một ra
    const paragraphArray = dataReturn.messageReturn.split('\n\n')

    if (paragraphArray.length > 0) {

      // console.log('🚀 ~ file: chatbot.service.js:336 ~ testChatGPT ~ paragraphArray:', paragraphArray)
      // lấy ra được đoaạn đầu và đoạn cuối (Mở đầu và kết thúc)
      setTextIntroduce(prev => paragraphArray[0].trim()) 
      // dispatch(updateCurrentItinerary({
      //   textEnding,
      //   dataDay,
      //   textIntroduce: paragraphArray[0].trim()
      // }))
      // Xóa phần tử đàu của mảng
      paragraphArray.shift()

      // có một lưu ý nhỏ, khi streaming chắc chắn sẽ chưa có đoạn cuối ngay được nên phải check với isDoneTreaming
      // if (isDoneTreaming) {
      //   setTextEnding(prev => paragraphArray[paragraphArray.length - 1].trim())
      // }

      // xóa phần tử cuối của mảng
      paragraphArray.pop()

      if (paragraphArray.length > 0) {
        paragraphArray.map((paragraph, index) => {
          // phân ra từ "\n" và xóa thằng đàu tiền của mảng
          const originalDay = paragraph.split('\n')
          originalDay.shift()
          // console.log('🚀 ~ file: chatbot.service.js:347 ~ paragraphArray.map ~ originalDay:', originalDay)
          const dataDay = {
            numberOfDay: index + 1,
            morning: originalDay[0].replace('- Sáng:', '').trim() ?? originalDay[0].replace('Sáng:', '').trim(),
            noon: originalDay[1].replace('- Trưa:', '').trim() ?? originalDay[1].replace('Trưa:', '').trim(),
            afternoon: originalDay[2].replace('- Chiều:', '').trim() ?? originalDay[2].replace('Chiều:', '').trim(),
            evening: originalDay[3].replace('- Tối:', '').trim() ?? originalDay[3].replace('Tối:', '').trim()
          }
          result.push(dataDay)
        })
      }
      setDataDay(prev => result)
      // dispatch(updateCurrentItinerary({
      //   textEnding,
      //   textIntroduce,
      //   dataDay: paragraphArray[0].trim()
      // }))
      setNumberDayToTravel(prev => {
        const array = []
        for (let index = 1; index <= numberDayToTravel.length - result.length; index++) {
          array.push(index)
        }
        return array
      })
    }
  }
}

const handleFitCoors = (arrPlace ,edgePadding, haveAnimate) => {
  mapRef.current?.fitToCoordinates(
    arrPlace,
    { edgePadding: edgePadding },
    haveAnimate
  )
}

const moveToMap = async (position, zoom, pitch) => {
  mapRef.current?.animateCamera({
    center: {
      ...position
    },
    heading: 0,
    pitch: pitch,
    zoom: zoom
  }, 500)
}

const handleMarkerPress = (mapEventData) => {
  // // console.log('mapEventData', mapEventData)
  // eslint-disable-next-line no-underscore-dangle
  const markerID = mapEventData._targetInst.return.key
  // console.log("🚀 ~ file: MapScreen.jsx:340 ~ handleMarkerPress ~ markerID:", markerID)

  let x = (markerID * CARD_WIDTH) + (markerID * 20)
  if (Platform.OS === 'ios') {
    x -= SPACING_FOR_CARD_INSET
  }
  
  setMapIndex(markerID)
  cardScrollViewRef.current.scrollTo({ x, y: 0, animated: false })
}
const handlePressPlace = (placeName) => {
  // console.log("🚀 ~ file: MessageFeature.js:529 ~ handlePressPlace ~ placeName:", placeName)
  const placeToNavigate = data.dataTravelPlaces.find(i => i.name === placeName) ?? data.dataFnbPlaces.find(i => i.name === placeName)
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
}

  if (action ==='input.welcome') {
    return
  } else if (action ==='input.suggest-place') {
    return (
      <ScrollView 
        horizontal={true}
        style={[{backgroundColor: 'white'}, app_sp.pb_10]}
        contentContainerStyle={{flexGrow: 1}}
        showsHorizontalScrollIndicator={false}
      >
        {
        !places
        ? [1, 2, 3, 4, 5].map((value, index) => {
            let actualStyle = [app_sp.me_18, {marginTop: 10}];
            if(index === 0) actualStyle.push({marginLeft: 5});
            return <VerticalPlaceCardSkeleton key={value + index} style={actualStyle} />
        })
        : places.map((place, index) => {
            let actualStyle = [app_sp.me_18, {marginTop: 10}];
            if(index === 0) actualStyle.push({marginLeft: 5});
            return <VerticalPlaceCard place={place} placeIndex={index} typeOfBriefPlace={typePlace} style={actualStyle} key={place.place_id} isChatBotScreen={true}/>
        })
        }
      </ScrollView>
    )
  } else if (action ==='input.get-weather') {
    const weatherData = data

    const weatherHours = [moment(new Date(weatherData.weatherCurrent.dt * 1000)).format("kk:mm"), ...weatherData.weatherForecast.map(i => {return moment(new Date(i.dt * 1000)).format("kk:mm")})]
    const weatherValues = [weatherData.weatherCurrent.main.temp.toFixed(1), ...weatherData.weatherForecast.map(i => {return i.main.temp.toFixed(1)})]
    const weatherTexts = [`${weatherData.weatherCurrent.main.temp.toFixed(1)}°`, ...weatherData.weatherForecast.map(i => {return `${i.main.temp.toFixed(1)}°`})]
    const weatherIcon = [weatherData.weatherCurrent.weather[0].icon, ...weatherData.weatherForecast.map(i => {return i.weather[0].icon})]

    const Data = {
      values: weatherValues,
      textTop: weatherHours, 
      textBottom: weatherTexts,
      iconBottom: weatherIcon,
    };
    
    const Settings = {
      showTextTop: true,
      showTextBottom: true,
      showIconTop: false,
      showIconBottom: true,
      // showVerticalLines: true,
      colSpace: 60,
      lineColor: app_c.HEX.ext_third,
      vlineColor: app_c.HEX.ext_third,
      topTextColor: app_c.HEX.ext_third,
      bottomTextColor: app_c.HEX.ext_third,
      // markerFillColor: app_c.HEX.ext_third,
      markerStrokeColor: app_c.HEX.ext_third,
      noDataTextColor: app_c.HEX.fourth,
      iconTopColor: app_c.HEX.fourth,
      iconBottomColor: app_c.HEX.fourth,
      iconSize: 30
    };

    return (
      <View style={{
        backgroundColor: app_c.HEX.ext_primary,
        height: 280,
        borderRadius:12,
        marginTop: 10,
        width: '90%'
      }}>
        <View style={{
          width: 300,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingVertical: 5
        }}>
            <TouchableOpacity 
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row'
              }}
              onPress={() => {
                if (weatherHourSelectedIndex > 0) {
                    console.log("🚀 ~ file: QuickReplies.js:278 ~ QuickReplies ~ weatherHourSelectedIndex:", weatherHourSelectedIndex)
                    if (weatherHourSelectedIndex === 1) {
                        setWeatherDataSelected({
                            icon: weatherIcons[weatherData.weatherCurrent.weather[0].icon],
                            temp: `${weatherData.weatherCurrent.main.temp.toFixed(1)}°C`,
                            description: weatherData.weatherCurrent.weather[0].description,
                            address: weatherData.nameGeocoding,
                            wind: `${weatherData.weatherCurrent.wind.speed.toFixed(1)}km/h`,
                            humidity: `${weatherData.weatherCurrent.main.humidity}%`,
                            clouds: `${weatherData.weatherCurrent.clouds.all}%`,
                            visibility: `${(weatherData.weatherCurrent.visibility/1000).toFixed(1)}km`,
                            temp_min: `${weatherData.weatherCurrent.main.temp_min.toFixed(1)}°C`,
                            temp_max: `${weatherData.weatherCurrent.main.temp_max.toFixed(1)}°C`,
                        })
                    } else {
                        const index = weatherHourSelectedIndex === 0 ? weatherHourSelectedIndex : weatherHourSelectedIndex - 1
                        setWeatherDataSelected({
                            icon: weatherIcons[weatherData.weatherForecast[index].weather[0].icon],
                            temp: `${weatherData.weatherForecast[index].main.temp.toFixed(1)}°C`,
                            description: weatherData.weatherForecast[index].weather[0].description,
                            address: weatherData.nameGeocoding,
                            wind: `${weatherData.weatherForecast[index].wind.speed.toFixed(1)}km/h`,
                            humidity: `${weatherData.weatherForecast[index].main.humidity}%`,
                            clouds: `${weatherData.weatherForecast[index].clouds.all}%`,
                            visibility: `${(weatherData.weatherForecast[index].visibility/1000).toFixed(1)}km`,
                            temp_min: `${weatherData.weatherForecast[index].main.temp_min.toFixed(1)}°C`,
                            temp_max: `${weatherData.weatherForecast[index].main.temp_max.toFixed(1)}°C`,
                        })
                    }
                    if (weatherHourSelectedIndex !== 0)
                        setWeatherHourSelectedIndex(weatherHourSelectedIndex - 1)
                }
              }}
            >
              <MaterialIcons
                name="arrow-back-ios"
                size={25}
                color={weatherHourSelectedIndex > 0 ? app_c.HEX.ext_second : app_c.HEX.ext_third}
              />
            </TouchableOpacity>

            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              alignSelf: 'center'
            }}>
            <Image source={weatherDataSelected.icon} 
            style={{
              height: 80,
              width: 80,
              ...app_shdw.type_1,
              marginLeft: -5,
              marginBottom: -10
            }}/>
            <View>
                <Text 
                style={{
                    color: app_c.HEX.ext_second,
                    ...app_typo.fonts.normal.normal.h3,
                }}
                >{weatherDataSelected.temp}</Text>
                <Text
                style={{
                    color: app_c.HEX.ext_second,
                    ...app_typo.fonts.normal.normal.h5,
                    
                }}
                >{weatherDataSelected.address}</Text>
                <Text
                style={{
                    color: app_c.HEX.ext_second,
                    ...app_typo.fonts.normal.normal.h5,
                    fontSize: 12
                }}
                >{weatherDataSelected.description}</Text>
            </View>
            </View>

            <TouchableOpacity
                style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    marginRight: -5
                }}
                onPress={() => {
                    // Kieemr tra thằng này nó có nhở hơn 40 nêu có là vẫn bấm được
                    if (weatherHourSelectedIndex <= weatherData.weatherForecast.length) {
                        console.log("🚀 ~ file: QuickReplies.js:278 ~ QuickReplies ~ weatherHourSelectedIndex:", weatherHourSelectedIndex)
                        const index = weatherHourSelectedIndex === 0 ? weatherHourSelectedIndex : weatherHourSelectedIndex - 1
                        setWeatherDataSelected({
                            icon: weatherIcons[weatherData.weatherForecast[index].weather[0].icon],
                            temp: `${weatherData.weatherForecast[index].main.temp.toFixed(1)}°C`,
                            description: weatherData.weatherForecast[index].weather[0].description,
                            address: weatherData.nameGeocoding,
                            wind: `${weatherData.weatherForecast[index].wind.speed.toFixed(1)}km/h`,
                            humidity: `${weatherData.weatherForecast[index].main.humidity}%`,
                            clouds: `${weatherData.weatherForecast[index].clouds.all}%`,
                            visibility: `${(weatherData.weatherForecast[index].visibility/1000).toFixed(1)}km`,
                            temp_min: `${weatherData.weatherForecast[index].main.temp_min.toFixed(1)}°C`,
                            temp_max: `${weatherData.weatherForecast[index].main.temp_max.toFixed(1)}°C`,
                        })
                        if (weatherHourSelectedIndex !== weatherData.weatherForecast.length)
                            setWeatherHourSelectedIndex(weatherHourSelectedIndex + 1)
                    }
                }}
            >
                <MaterialIcons
                    name="arrow-forward-ios"
                    size={25}
                    color={weatherHourSelectedIndex < weatherData.weatherForecast.length ? app_c.HEX.ext_second : app_c.HEX.ext_third}
                />
            </TouchableOpacity>
        </View>

        <View style={{
            height: 20,
            width: 300,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 18,
            flexGrow: 1
        }}>
            <View style={{
                flex: 0.3,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <Fontisto name='wind' size={14} color={app_c.HEX.ext_second}/>
                <AppText numberOfLines={1} style={{...app_typo.fonts.normal.bolder.body2,marginLeft:6, color: app_c.HEX.ext_second}}>{weatherDataSelected.wind}</AppText>
            </View>
            
            <View style={{
                flex: 0.4,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: 15
            }}>
                <Entypo name='water' size={14} color={app_c.HEX.ext_second}/>
                <AppText numberOfLines={1} style={{...app_typo.fonts.normal.bolder.body2,marginLeft:6, color: app_c.HEX.ext_second}}>{weatherDataSelected.humidity}</AppText>

            </View>
            
            <View style={{
                flex: 0.3,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <FontAwesome5 name='temperature-high' size={14} color={app_c.HEX.ext_second}/>
                <AppText numberOfLines={1} style={{...app_typo.fonts.normal.bolder.body2,marginLeft:6, color: app_c.HEX.ext_second}}>{weatherDataSelected.temp_max}</AppText>
            </View>
        </View>
        
        <View style={{
            // height: 25,
            width: 300,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 18,
            marginBottom: 10,
            flexGrow: 1
        }}>
            <View style={{
                flex: 0.3,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <Entypo name='cloud' size={14} color={app_c.HEX.ext_second}/>
                <AppText numberOfLines={1} style={{...app_typo.fonts.normal.bolder.body2,marginLeft:6, color: app_c.HEX.ext_second}}>{weatherDataSelected.clouds}</AppText>
            </View>
            
            <View style={{
                flex: 0.4,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: 15
            }}>
                <MaterialCommunityIcons name='weather-fog' size={14} color={app_c.HEX.ext_second}/>
                <AppText numberOfLines={1} style={{...app_typo.fonts.normal.bolder.body2,marginLeft:6, color: app_c.HEX.ext_second}}>{weatherDataSelected.visibility}</AppText>
            </View>
            
            <View style={{
                flex: 0.3,
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <FontAwesome5 name='temperature-low' size={14} color={app_c.HEX.ext_second}/>
                <AppText numberOfLines={1} style={{...app_typo.fonts.normal.bolder.body2,marginLeft:6, color: app_c.HEX.ext_second}}>{weatherDataSelected.temp_min}</AppText>
            </View>
        </View>

        <WeatherChart data={Data} settings={Settings} selectedIndex={weatherHourSelectedIndex} 
        handeChangeIndex={(index) => {
        console.log("==========================================", index)

          setWeatherHourSelectedIndex(index)
          if (index === 0) {
            setWeatherDataSelected({
              icon: weatherIcons[weatherData.weatherCurrent.weather[0].icon],
              temp: `${weatherData.weatherCurrent.main.temp.toFixed(1)}°C`,
              description: weatherData.weatherCurrent.weather[0].description,
              address: weatherData.nameGeocoding,
              wind: `${weatherData.weatherCurrent.wind.speed.toFixed(1)}km/h`,
              humidity: `${weatherData.weatherCurrent.main.humidity}%`,
              clouds: `${weatherData.weatherCurrent.clouds.all}%`,
              visibility: `${(weatherData.weatherCurrent.visibility/1000).toFixed(1)}km`,
              temp_min: `${weatherData.weatherCurrent.main.temp_min.toFixed(1)}°C`,
              temp_max: `${weatherData.weatherCurrent.main.temp_max.toFixed(1)}°C`,
          })
        } else {
          setWeatherDataSelected({
            icon: weatherIcons[weatherData.weatherForecast[index - 1].weather[0].icon],
            temp: `${weatherData.weatherForecast[index - 1].main.temp.toFixed(1)}°C`,
            description: weatherData.weatherForecast[index - 1].weather[0].description,
            address: weatherData.nameGeocoding,
            wind: `${weatherData.weatherForecast[index - 1].wind.speed.toFixed(1)}km/h`,
            humidity: `${weatherData.weatherForecast[index - 1].main.humidity}%`,
            clouds: `${weatherData.weatherForecast[index - 1].clouds.all}%`,
            visibility: `${(weatherData.weatherForecast[index - 1].visibility/1000).toFixed(1)}km`,
            temp_min: `${weatherData.weatherForecast[index - 1].main.temp_min.toFixed(1)}°C`,
            temp_max: `${weatherData.weatherForecast[index - 1].main.temp_max.toFixed(1)}°C`,
          })
        }
        }}
        />
      </View>
    );
  } else if (action ==='input.location-on-map') {
    
    return (
      <View style={{
        height: 400,
        width: 300,
        marginTop: 15,
        position: 'relative'
      }}>
        <MapView
          ref={mapRef}
          mapType={mapType}
          mapPadding={{
            top: 0,
            right: 20,
            bottom: 100,
            left: 20
          }}
          style={{
            height: 400,
            width: 300,
            ...app_sh.rounded_16,
            ...app_shdw.type_4
          }}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_POSITION}
        >
          {placesTextSearch.map((place, index) => {
            const coordinate = {
              latitude: place.geometry.location.lat,
              longitude:  place.geometry.location.lng,
            }
            if (index === mapIndex) {
              return (
                <Marker
                  key={index}
                  coordinate={coordinate}
                  onPress={(e) => handleMarkerPress(e)}
                />
              )
            } else 
              return (
                <Marker
                  key={index}
                  coordinate={coordinate}
                  onPress={(e) => handleMarkerPress(e)}
                  pinColor={app_c.HEX.ext_second}
                  style={{transform: [{scaleX: 0.5}]}}
                />
              )
          })}
          {/* {
            placesTextSearch.map((place, index) => {
              const coordinate = {
                latitude: place.geometry.location.lat,
                longitude:  place.geometry.location.lng,
              }
              return (
                <Marker
                  key={index}
                  coordinate={coordinate}
                  onPress={(e) => {
                    moveToMap(coordinate, 14, 0)
                    console.log('sadsad', arrPlaceToFitCoor)
                  }}
                />
              )
            })
          } */}
        </MapView>

        {/* Loading for map */}
        {
          isShowLoading &&
          <View style={styles.loadingForMap}>
            <ActivityIndicator size="small" color={app_c.HEX.fourth}/>
          </View>
        }
        {/* Phuong: Scroll cards place */}
        {
          placesTextSearch ? 
          <Animated.ScrollView
            ref={cardScrollViewRef}
            horizontal
            snapToStart={false}
            pagingEnabled
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 20}
            snapToAlignment="center"
            style={[styles.cardScrollView]}
            contentInset={{
              top: 0,   
              left:SPACING_FOR_CARD_INSET,
              bottom: 0,
              right: SPACING_FOR_CARD_INSET
            }}
            contentContainerStyle={{
              paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
            }}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: mapAnimation,
                    }
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          >
            {placesTextSearch.map((place, index) => {
              
              // console.log("=======================================", place?.photos[0])

              return (
                <View style={styles.card} key={`${place.place_id}-place-${index}`}>
                  {
                    place.photos ? 
                    <ImagePromise
                      isTranformData={true}
                      photoReference={place?.photos[0]}
                      styleImage={styles.cardImage}
                    /> :
                    <View 
                      style={styles.cardNoImage}
                    >
                      <Text style={styles.noImageText}>No image</Text>
                    </View>
                  }
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{place.name}</Text>
                    <StarRating 
                      ratings={place.rating} 
                      reviews={place.user_ratings_total} 
                      textRatingStyle={{...app_typo.fonts.normal.normal.body2}} 
                      textReviewStyle={{...app_typo.fonts.normal.normal.body2}}
                    />
                    <Text
                      numberOfLines={1}
                      style={styles.cardDescription}
                    >
                      {place.editorial_summary ? place.editorial_summary : place.formatted_address}
                    </Text>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('MapFullScreen', {
                        place_id: place.place_id, 
                        fromScreen: 'ChatBotScreen',
                        isFullScreen: true
                      })}
                    >
                      <Text
                        style={styles.buttonViewMap}
                      >
                        Xem trên bản đồ chính
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
            {
              isShowRefreshCard &&
              <View style={styles.refreshContainer}>
                <ActivityIndicator size="small" color={app_c.HEX.fourth}/>
              </View>
            }
          </Animated.ScrollView> : null
        }
        {
          mapType === 'standard' && 
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
            }}
            onPress={() => setMapType('satellite')}
          >
            <Image
              source={require('../../assets/images/map_type/satellite.jpg')}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: app_c.HEX.primary,
                ...app_shdw.type_2
              }}
            />
          </TouchableOpacity> 
        }
        {
          mapType === 'satellite' && 
          <TouchableOpacity
              style={{
                position: 'absolute',
                left: 10,
                top: 10
              }}
              onPress={() => setMapType('standard')}
            >
              <Image
                source={require('../../assets/images/map_type/standard.jpg')}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: app_c.HEX.primary,
                  ...app_shdw.type_4
                }}
              />
          </TouchableOpacity>

        }
          <TouchableOpacity
            onPress={() => navigation.navigate('MapFullScreen',{
              fromScreen: 'ChatBotScreen',
              isFullScreen: true,
              condition: 'VIEW_ALL_PLACES_ON_MAIN_MAP',
              data: {
                placeTextSearch: placesTextSearch,
                nextPageToken: nextPageToken,
                query: data?.query,
                arrPlaceToFitCoor: arrPlaceToFitCoor,
                divertDataToChatBot: (dataFromMapScreen) => {
                  setNextPageToken(dataFromMapScreen.nextPageToken)
                  setPlacesTextSearch([
                    ...placesTextSearch,
                    ...dataFromMapScreen.placeTextSearchMore
                  ])
                }
              },
            })}
            style={{
              position: 'absolute',
              left: 10,
              top: 60,
              height: 40,
              width: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: app_c.HEX.primary,
              backgroundColor: app_c.HEX.third,
              ...app_shdw.type_2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={20}
              color={app_c.HEX.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10,
            top: 110,
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: app_c.HEX.primary,
            backgroundColor: app_c.HEX.third,
            ...app_shdw.type_2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => {
            if (arrPlaceToFitCoor.length === 1) {
              // Mình sẽ tạo ra thêm 2 thằng nữa để phục vụ animate ngay chỗ mình
              const freeCoor1 = computeDestinationPoint(
                arrPlaceToFitCoor[0],
                10000,
                180
              )

              const freeCoor2 = computeDestinationPoint(
                arrPlaceToFitCoor[0],
                10000,
                0
              )
              
              setArrPlaceToFitCoor(prevState => {
                return [
                  freeCoor1,
                  ...prevState,
                  freeCoor2
                ] 
              })
            }

            const edgePadding = {
              top: 0,
              right: 0,
              bottom: 100,
              left: 0
            }
      
            handleFitCoors(arrPlaceToFitCoor, edgePadding, true)
          }}
        >
          <Foundation 
            name='arrows-in' 
            size={20} 
            color={app_c.HEX.primary}
          />
        </TouchableOpacity>
      </View>
    );
  } else if (action ==='input.direction-a-to-b') {
    return (
      <View style={{
        height: 400,
        width: 300,
        marginTop: 15,
        position: 'relative'
      }}>
        <MapView
          ref={mapRef}
          mapType={mapType}
          mapPadding={{
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          }}
          style={{
            height: 400,
            width: 300,
            ...app_sh.rounded_16,
            ...app_shdw.type_4
          }}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_POSITION}
        >
        {
        arrPlaceToFitCoor && 
        <Marker 
          coordinate={arrPlaceToFitCoor[0]}
          anchor={{
            x: 0.5,
            y: 0.5
          }}
        >
          <View style={{
            backgroundColor: app_c.HEX.primary,
            borderRadius: 12.5,
            height: 25,
            width: 25,
          }}>
            <Ionicons
              name="navigate-circle"
              size={25}
              color={app_c.HEX.third}
              style={{ position: 'absolute', top: -1}}
            />
          </View>
          
        </Marker>
        }

        {/* Show my result when I search location */}
        {arrPlaceToFitCoor && <Marker coordinate={arrPlaceToFitCoor[arrPlaceToFitCoor.length -1]} />}
          
          {/* Polyline chính + phụ */}
          {
            directionsPolyLine ? 
            directionsPolyLine.map((directionPolyLine, index) => {
              return (
                <PolyLineDirection
                  key={`PolyLineDirection-${index}`}
                  calloutRef={index === 0 ? calloutRef0 : (index === 1 ? calloutRef1 : calloutRef2)}
                  directionPolyLine={directionPolyLine}
                  directionPolyLineIndex={index}
                  selectedPolyLine={selectedPolyLine}
                  onPressPolyLine={() => {
                    // Đặt lại index
                    setSelectedPolyLine(index)
                    // chỉnh ngày giờ và km
                    handleDatetimeAndDistance(directionPolyLine?.distanceMeters, directionPolyLine?.staticDuration)
                    let edgePadding
                    edgePadding = {
                      top: 10,
                      right: 10,
                      bottom: 10,
                      left: 10
                    }

                    // Cho nó focus vào 
                    handleFitCoors(directionPolyLine?.polyline, edgePadding, true)
                  }}
                  onPressCallout={() => {
                    if (index === 0 && calloutRef0.current !== null)
                      calloutRef0?.current.hideCallout()
                    else if (index === 1 && calloutRef1.current !== null)
                      calloutRef1?.current.hideCallout()
                    else if (index === 2 && calloutRef2.current !== null)
                      calloutRef2?.current.hideCallout()
                  }}
                />
              )
            }) : null
          } 
        </MapView>

        {/* Loading for map */}
        {
          isShowLoading1 ?
          <View style={styles.loadingForMap}>
            <ActivityIndicator size="small" color={app_c.HEX.fourth}/>
          </View> : null
        }
        
        {
          mapType === 'standard' && 
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              bottom: 110,
            }}
            onPress={() => setMapType('satellite')}
          >
            <Image
              source={require('../../assets/images/map_type/satellite.jpg')}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: app_c.HEX.primary,
                ...app_shdw.type_2
              }}
            />
          </TouchableOpacity> 
        }
        {
          mapType === 'satellite' && 
          <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                bottom: 110
              }}
              onPress={() => setMapType('standard')}
            >
              <Image
                source={require('../../assets/images/map_type/standard.jpg')}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: app_c.HEX.primary,
                  ...app_shdw.type_4
                }}
              />
          </TouchableOpacity>

        }
          <TouchableOpacity
            onPress={() => navigation.navigate('MapFullScreen',{
              fromScreen: 'ChatBotScreen',
              isFullScreen: true,
              condition: 'VIEW_ALL_DIRECTIONS_ON_MAIN_MAP',
              data: {
                directionsPolyLine: directionsPolyLine,
                dataTime: {
                  days: dataTime.days,
                  hours: dataTime.hours,
                  minutes: dataTime.minutes,
                  seconds: dataTime.seconds
                },
                distance: distance,
                textOrigin: 'Điểm đi',
                textDestination: 'Điểm đến',
                directionOriPlaceId: directionOriPlaceId,
                directionDesPlaceId: directionDesPlaceId,
                oriRouteInfo: oriRouteInfo, 
                desRouteInfo: desRouteInfo
              },
            })}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 60,
              height: 40,
              width: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: app_c.HEX.primary,
              backgroundColor: app_c.HEX.third,
              ...app_shdw.type_2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={20}
              color={app_c.HEX.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: app_c.HEX.primary,
            backgroundColor: app_c.HEX.third,
            ...app_shdw.type_2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => {
            if (arrPlaceToFitCoor.length === 1) {
              // Mình sẽ tạo ra thêm 2 thằng nữa để phục vụ animate ngay chỗ mình
              const freeCoor1 = computeDestinationPoint(
                arrPlaceToFitCoor[0],
                10000,
                180
              )

              const freeCoor2 = computeDestinationPoint(
                arrPlaceToFitCoor[0],
                10000,
                0
              )
              
              setArrPlaceToFitCoor(prevState => {
                return [
                  freeCoor1,
                  ...prevState,
                  freeCoor2
                ] 
              })
            }

            const edgePadding = {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
            }
      
            handleFitCoors(arrPlaceToFitCoor, edgePadding, true)
          }}
        >
          <Foundation 
            name='arrows-in' 
            size={20} 
            color={app_c.HEX.primary}
          />
        </TouchableOpacity>
      </View>
    );
  } else if (action ==='input.where-am-i') {
    return (
      <View style={{
        height: 300,
        width: 300,
        marginTop: 15,
        ...app_sh.rounded_16,
        overflow: 'hidden'
      }}>
        <MapView
          ref={mapRef}
          mapType={mapType}
          mapPadding={{
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          }}
          style={{
            height: 300,
            width: 300,
            ...app_sh.rounded_16,
            ...app_shdw.type_4
          }}
          provider={PROVIDER_GOOGLE}
          initialRegion={INITIAL_POSITION}
        >
          {myLocation && <Marker coordinate={myLocation} />}
        </MapView>

        <TouchableOpacity
            onPress={() => navigation.navigate('MapFullScreen',{
              fromScreen: 'ChatBotScreen',
              isFullScreen: true
            })}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 60,
              height: 40,
              width: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: app_c.HEX.primary,
              backgroundColor: app_c.HEX.third,
              ...app_shdw.type_2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={20}
              color={app_c.HEX.primary}
            />
          </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: app_c.HEX.primary,
            backgroundColor: app_c.HEX.third,
            ...app_shdw.type_2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => moveToMap(myLocation, 14, 0)}
        >
          <FontAwesome5 
            name='location-arrow' 
            size={18} 
            color={app_c.HEX.primary}
          />
        </TouchableOpacity>
      </View>
    )
  } else if (action ==='input.travel-itinerary') {
    return (
      <View style={{
        width: 310,
        marginTop: 15,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        ...app_shdw.type_3
      }}>
        <TouchableOpacity
          style={{
            width: '100%',
            marginBottom: 5,
            marginTop: -3,
            display: 'flex',
            alignItems:'flex-end',
          }}
          onPress={() => navigation.navigate('ItineraryDetailScreen', {
            dataDay,
            placeToTravel: data?.placeToTravel,
            numberDayToTravel: numberDay,
            textIntroduce,
            textEnding,
            dataFnbPlaces: data?.dataFnbPlaces,
            dataTravelPlaces: data?.dataTravelPlaces
          })}
        >
          <FontAwesome
            name="external-link"
            size={20}
            color={app_c.HEX.third}
          />
        </TouchableOpacity>
        {
          textIntroduce ? 
          <Text style={{
            marginHorizontal: 5,
            marginBottom: 10,
            ...app_typo.fonts.normal.normal.body1,
            color: app_c.HEX.fourth,
            textAlign: 'justify'
          }}>{textIntroduce}</Text> :
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: 10
          }}>
            {
              [1, 2, 3].map(i => (
                <Skeleton
                  skeletonStyle={{
                    height: 15,
                    width: "100%",
                    borderRadius: 12,
                    marginTop: 5
                  }}
                />
              ))
            }
          </View>
        }


        {/* {
          [1, 2, 3].map(i => (
            <View>
              <View style={{
                flexDirection: 'row',
              }}>
                <Skeleton
                  skeletonStyle={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    marginTop: 10
                  }}
                />
              
                <View style={{
                  flexDirection: 'column',
                  flex: 1,
                  marginLeft: 10,
                  justifyContent: 'center'
                }}>
                  {
                    [1,2,3,4,5,6].map(i => (
                      <Skeleton
                        skeletonStyle={{
                          height: 15,
                          width: "100%",
                          borderRadius: 12,
                          marginTop: 5
                        }}
                      />
                    ))
                  }
                </View>
              </View>
            </View>
          ))
        } */}
            
        {
          dataDay.length > 0 &&
          dataDay.map((dataSlice, index) => {
           
            const regex = /\[(.*?)\]/g

            let getPhoto, namePlaces
            const afternoonPlaces = dataSlice.afternoon.match(regex)
            namePlaces = afternoonPlaces && afternoonPlaces.map(match => match.slice(1, -1));
            // console.log("🚀 ~ file: MessageFeature.js:1585 ~ MessageFeature ~ namePlaces:", namePlaces)
            getPhoto = data.dataTravelPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference ?? data.dataFnbPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference
            // console.log("🚀 ~ file: MessageFeature.js:1586 ~ MessageFeature ~ getPhoto:", getPhoto)
            // if (!getPhoto) {
            //   const noonPlaces = dataSlice.noon.match(regex)
            //   namePlaces = noonPlaces && noonPlaces.map(match => match.slice(1, -1));
            //   getPhoto = data.dataTravelPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference ?? data.dataFnbPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference
            // }

            // if (!getPhoto) {
            //   const afternoonPlaces = dataSlice.afternoon.match(regex)
            //   namePlaces = afternoonPlaces && afternoonPlaces.map(match => match.slice(1, -1));
            //   getPhoto = data.dataTravelPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference ?? data.dataFnbPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference
            // }

            // if (!getPhoto) {
            //   const eveningPlaces = dataSlice.evening.match(regex)
            //   namePlaces = eveningPlaces && eveningPlaces.map(match => match.slice(1, -1));
            //   getPhoto = data.dataTravelPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference ?? data.dataFnbPlaces.find(i => i.name === namePlaces[0])?.photos[0].photo_reference
            // }

            return (
              <TouchableOpacity
                style={{
                  flexDirection:'row',
                  alignItems: 'center',
                  marginTop: index !==0 ? 15 : 0,
                  position: 'relative',
                  elevation: 0
                }}
                onPress={() => {
                  navigation.navigate('ItineraryDetailScreen', {
                    dataDay,
                    placeToTravel: data?.placeToTravel,
                    numberDayToTravel: numberDay,
                    textIntroduce,
                    textEnding,
                    dataFnbPlaces: data?.dataFnbPlaces,
                    dataTravelPlaces: data?.dataTravelPlaces
                  })
                }}
              >
                {
                  getPhoto ?
                  <View style={{...app_shdw.type_3}}>
                    <ImagePromise
                      fromChatBot={true}
                      isTranformData={false}
                      photoReference={getPhoto}
                      styleImage={styles.imageCardDay}
                      map_api_key={map_api_key}
                    />
                  </View> :
                  <View
                    style={[styles.imageCardDay, {backgroundColor: app_c.HEX.ext_primary}]}
                  />
                }
                <View style={{
                  position: 'absolute',
                  top: Platform.OS === 'ios' ? 15 : 25,
                  left: 8,
                  display: 'flex',
                  height: 20,
                  width: 65,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: app_c.HEX.third,
                  opacity: 0.8,
                  flexDirection: 'row'
                }}>
                  <FontAwesome5 name='calendar-day' size={10} color={app_c.HEX.primary} style={{
                    marginTop: -2
                  }}/>
                  <Text style={{
                    color: app_c.HEX.primary,
                    ...app_typo.fonts.italic.bolder.body2,
                    marginLeft: 5
                  }}>Ngày {dataSlice.numberOfDay}</Text>
                </View>
                <View style={{
                  flexDirection: 'column',
                  width: 1,
                  marginLeft: 5,
                }}>
                  <View style={{
                    flexDirection: 'row',
                    width: 150,
                    marginTop: 5,
                  }}>
                    <Octicons
                      name='dot-fill'
                      size={10}
                      color={app_c.HEX.ext_second}
                      style={{ marginHorizontal: 5, marginTop: 2,}}
                    />
                    <ButtonInText numberOfLines={2} textRaw={'Buổi sáng: ' + dataSlice.morning} handlePressPlace={(placeName) => handlePressPlace(placeName)}/>
                  </View>

                  <View style={{
                    flexDirection: 'row',
                    width: 150,
                    marginTop: 5,
                  }}>
                    <Octicons
                      name='dot-fill'
                      size={10}
                      color={app_c.HEX.ext_second}
                      style={{ marginHorizontal: 5, marginTop: 2}}
                    />
                      <ButtonInText numberOfLines={2} textRaw={'Buổi trưa: ' + dataSlice.noon} handlePressPlace={(placeName) => handlePressPlace(placeName)}/>
                  </View>

                  <View style={{
                    flexDirection: 'row',
                    width: 150,
                    marginTop: 5,
                  }}>
                    <Octicons
                      name='dot-fill'
                      size={10}
                      color={app_c.HEX.ext_second}
                      style={{ marginHorizontal: 5, marginTop: 2}}
                    />
                    <ButtonInText numberOfLines={2} textRaw={'Buổi chiều: ' + dataSlice.afternoon} handlePressPlace={(placeName) => handlePressPlace(placeName)}/>
                  </View>

                  <View style={{
                    flexDirection: 'row',
                    width: 150,
                    marginTop: 5,
                  }}>
                    <Octicons
                      name='dot-fill'
                      size={10}
                      color={app_c.HEX.ext_second}
                      style={{ marginHorizontal: 5, marginTop: 2}}
                    />
                      <ButtonInText numberOfLines={2} textRaw={'Buổi tối: ' + dataSlice.evening} handlePressPlace={(placeName) => handlePressPlace(placeName)}/>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        }

        {
          numberDayToTravel.map(i => (
            <View>
              <View style={{
                flexDirection: 'row',
              }}>
                <Skeleton
                  skeletonStyle={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    marginTop: 10
                  }}
                />
              
                <View style={{
                  flexDirection: 'column',
                  flex: 1,
                  marginLeft: 10,
                  justifyContent: 'center'
                }}>
                  {
                    [1,2,3,4,5,6].map(i => (
                      <Skeleton
                        skeletonStyle={{
                          height: 15,
                          width: "100%",
                          borderRadius: 12,
                          marginTop: 5
                        }}
                      />
                    ))
                  }
                </View>
              </View>
            </View>
          ))
        }

        {
          textEnding ? 
          <Text style={{
            marginHorizontal: 5,
            marginTop: 15,
            marginBottom: 10,
            ...app_typo.fonts.normal.normal.body1,
            color: app_c.HEX.fourth,
            textAlign: 'justify'
          }}>{textEnding}</Text> :
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            marginVertical: 10
          }}>
            {
              [1, 2, 3].map(i => (
                <Skeleton
                  skeletonStyle={{
                    height: 15,
                    width: "100%",
                    borderRadius: 12,
                    marginTop: 5
                  }}
                />
              ))
            }
          </View>
        }
      </View>
    )
  } else {
    return 
  }
}

export default memo(MessageFeature) 