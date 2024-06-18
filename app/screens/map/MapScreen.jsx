import React, { useEffect, useMemo, useRef, useState, memo } from 'react'

// Related to redux
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentManifold, updateNotif } from 'redux/manifold/ManifoldSlice'
import { resetRoutes, selectCurrentFilter, updateRoutes } from 'redux/filter/FilterSlice'

// Related to component of react native
import {
  Animated,
  LayoutAnimation, 
  Platform, 
  Pressable, 
  Text, 
  TouchableOpacity, 
  View,
  Share,
  Keyboard,
  Linking,
  ActivityIndicator,
  Image,
} from 'react-native'

// https://gorhom.github.io/react-native-bottom-sheet/troubleshooting/#adding-horizontal-flatlist-or-scrollview-is-not-working-properly-on-android
import {
  ScrollView,
  FlatList
} from 'react-native-gesture-handler';

// Related to react navigation
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Related to Expo
import * as Location from 'expo-location'

// Related to map
import MapView, { Callout, Marker, Polygon, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
// import { MapViewWithHeading, ArrowedPolyline } from 'react-native-maps-line-arrow'
import { MapViewWithHeading, ArrowedPolyline } from 'libs/react-native-maps-line-arrow'

// Related to raw datas
import { coordinates } from 'utilities/coordinates'
import { typemapsearch } from 'utilities/typemapsearch'
import { typesPlace, typeModeTransport, maneuverData, weatherIcons, mapTypes } from 'utilities/mapdata'
import { FilterConstants, MAP_PLACES_CARD_DATA_FIELDS } from 'utilities/constants'

// Related to APis
import { getRouteDirectionAPI, getMorePlacesTextSearchAPI, getPlaceDetailsAPI, getPlacesTextSearchAPI, getWeatherCurrentAPI, getWeatherForecastAPI, getMapUserAPI, updateMapUserAPI } from 'apis/axios'

// Related to debounce
import { cloneDeep, debounce } from 'lodash'

// Related to Styles
import { styles } from './MapScreenStyles'
import { app_c, app_dms, app_sh, app_shdw, app_sp, app_typo } from 'globals/styles'

// Related to components
import { BottomSheetScroll, CheckBoxText, CircleButton } from 'components'
import ImagePromise from 'components/image_promise/ImagePromise'
import ReviewSectionPromise from 'components/review_section_promise/ReviewSectionPromise'
import Filter from 'components/filter/Filter'
import Category from 'components/categories/Category'
import InputAutoComplete from 'components/input_auto_complete/InputAutoComplete'
import StarRating from 'components/star_rating/StarRating'

// Related to Icons
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Foundation from 'react-native-vector-icons/Foundation'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'

// Related to component notification
import { useToast } from 'react-native-toast-notifications'

// Related to Animation
import { dropDownAnimation } from 'animations/dropDownAnimation'
import * as Animatable from 'react-native-animatable'

import { socketIoInstance } from '../../../App'
import { selectCurrentUser, selectTemporaryUserId } from 'redux/user/UserSlice'
import ImageModal from 'react-native-image-modal';
import { PolyLineDirection } from 'components/polyline_direction/PolyLineDirection'
import { BottomSheetFlatList, BottomSheetScrollView, BottomSheetView, BottomSheetVirtualizedList } from '@gorhom/bottom-sheet'

import { computeDestinationPoint } from 'geolib'
import moment from 'moment/moment'
import { selectCurrentMap, updateCurrentMap, updateMapDetails, updateMapTypes, updatePlaces, updateSuggestions } from 'redux/map/mapSlice'
import BottomSheetExample from '../../components/bottom_sheet/BottomSheetExample'
import { selectCurrentLanguage } from 'redux/language/LanguageSlice'
import Lightbox from 'react-native-lightbox-v2'
import StringUtility from 'utilities/string'
import FunctionsUtility from 'utilities/functions'

const Map = ({navigator}) => {
// Phương: https://docs.expo.dev/versions/latest/sdk/map-view/
  // Phương: https://www.npmjs.com/package/react-native-google-places-autocomplete
  //language

  const route = useRoute()
  const langData = useSelector(selectCurrentLanguage).data?.mapScreen
  const langCode = useSelector(selectCurrentLanguage).languageCode

  const contentNotificationBottomSheet = langCode === 'vi' ? 'Không có bất kỳ kết quả cho tìm kiếm của bạn!' : 'Do not have any result for your search!'

  const Stack = createNativeStackNavigator()
  const navigation = useNavigation()
  const toast = useToast()
  const user = useSelector(selectCurrentUser)
  const temporaryUserId = useSelector(selectTemporaryUserId)

  const map_api_key = useSelector(selectCurrentManifold).privateKeys?.map_api_key
  const ors_api_key = useSelector(selectCurrentManifold).privateKeys?.ors_api_key[0]

  const dispatch = useDispatch()

  const currentFilter = useSelector(selectCurrentFilter)
  console.log("🚀 ~ file: MapScreen.jsx:115 ~ currentFilter:", currentFilter)

  const [routesFilter, setRoutesFilter] = useState(currentFilter.routes)
  // console.log("🚀 ~ file: MapScreen.jsx:118 ~ routesFilter:", routesFilter)

  const currentMap = useSelector(selectCurrentMap)

  const CARD_HEIGHT = 240
  const CARD_WIDTH = app_dms.screenWidth * 0.8
  const SPACING_FOR_CARD_INSET = app_dms.screenWidth * 0.1 - 10

  const [weather, setWeather] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  const [origin, setOrigin] = useState('')
  const [textOrigin, setTextOrigin] = useState('')
  const [textSearchOrigin, setTextSearchOrigin] = useState('')
  
  const [markerLongPress, setMarkerLongPress] = useState(null);

  const [destination, setDestination] = useState(null)
  const [textDestination, setTextDestination] = useState('')
  const [textSearchDestination, setTextSearchDestination] = useState('')

  const [showDirections, setShowDirections] = useState(false)

  const [arrPlaceInput, setArrPlaceInput] = useState([])
  const [arrPlaceInputMainSearch, setArrPlaceInputMainSearch] = useState([])

  const [distance, setDistance] = useState(0)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [directionModeGCP, setDirectionModeGCP] = useState('DRIVE')
  const [directionModeORS, setDirectionModeORS] = useState('driving-car')
  
  const [tagModeSelected, setTagModeSelected] = useState('1')

  const [weatherSelected, setWeatherSelected] = useState(0)
  

  const [isModeScrollOn, setIsModeScrollOn] = useState(false)

  const [locationCurrent, setLocationCurrent] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [tagSelected, setTagSelected] = useState(typemapsearch[0].id)

  const [isOpenBottomSheetFilter, setIsOpenBottomSheetFilter] = useState(false)

  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false)
  const [isShowScrollCardPlace, setIsShowScrollCardPlace] = useState(false)

  const [placeDetails, setPlaceDetails] = useState(null)
  const [placeDetailsClone, setPlaceDetailsClone] = useState(null)
  const [placesTextSearch, setPlacesTextSearch] = useState(null)

  const [placesTextSearchClone, setPlacesTextSearchClone] = useState(null)

  const [arrImgBase64, setArrImgBase64] = useState([])

  const [isFocusedInput, setIsFocusedInput] = useState(false)
  const [isFocusedOriInput, setIsFocusedOriInput] = useState(false)
  const [isFocusedDesInput, setIsFocusedDesInput] = useState(false)
  const [isShowBackIcon, setIsShowBackIcon] = useState(false)
  const [previousTextSearch, setPreviousTextSearch] = useState('')
  
  const inputRef = useRef(null)
  const oriInputRef = useRef(null)
  const desInputRef = useRef(null)

  const calloutRef0 = useRef(null)
  const calloutRef1 = useRef(null)
  const calloutRef2 = useRef(null)
  const [isShowCallout, setIsShowCallout] = useState(false)
  

  const bottomSheetExampleRef = useRef(null)
  
  const [currentCoorArr, setCurrentCoorArr] = useState([])
  const [coorArrDirection, setCoorArrDirection] = useState([])
  const [directionsPolyLine, setDirectionsPolyLine] = useState([])
  const [stepPolyLine, setStepPolyLine] = useState([])
  const [stepPolyLineSelected, setStepPolyLineSelected] = useState(-1)
  const [selectedPolyLine, setSelectedPolyLine] = useState(0)
  const [directionOriPlaceId, setDirectionOriPlaceId] = useState(null)
  const [directionDesPlaceId, setDirectionDesPlaceId] = useState(null)
  
  const [arrPlaceToFitCoor, setArrPlaceToFitCoor] = useState([])

  const [isShowOptionRoute, setIsShowOptionRoute] = useState(false)
  const [isShowRoutePanel, setIsShowRoutePanel] = useState(true)
  
  const [isShowDirectionsBottomSheet, setIsShowDirectionsBottomSheet] = useState(false)
  const directionBottomSheetRef = useRef(null)

  const [isShowWeatherBottomSheet, setIsShowWeatherBottomSheet] = useState(false)
  const weatherBottomSheetRef = useRef(null)

  const [isShowFilterDirectionBottomSheet, setIsShowFilterDirectionBottomSheet] = useState(false)
  const filterDirectionBottomSheetRef = useRef(null)

  const [isShowMapTypeBottomSheet, setIsShowMapTypeBottomSheet] = useState(false)
  const mapTypeBottomSheetRef = useRef(null)

  const [oriRouteInfo, setOriRouteInfo] = useState(null)
  const [desRouteInfo, setDesRouteInfo] = useState(null)

  const [nextPageToken, setNextPageToken] = useState(null)

  const [isToggleOpenHours, setIsToggleOpenHours] = useState(false)

  const [isResizeMode, setIsResizeMode] = useState("cover")

  const animationDropdown = useRef(new Animated.Value(0)).current
  const handleToggleOpenHoursAnimation = () => {
    const config = {
      duration: 500,
      toValue: isToggleOpenHours ? 0 : 1,
      useNativeDriver: true
    }
    Animated.timing(animationDropdown, config).start()
    LayoutAnimation.configureNext(dropDownAnimation)
    setIsToggleOpenHours(!isToggleOpenHours)
  }

  const arrowTranform = animationDropdown.interpolate({
    inputRange: [0,1],
    outputRange: ['0deg', '-180deg']
  })

  const ASPECT_RATIO = app_dms.screenWidth / app_dms.screenHeight
  const LATITUDE_DELTA = 0.3
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
  const INITIAL_POSITION = {
    latitude: 10.9160571,
    longitude: 106.8323861,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }

  // số giây giữa các lần cập nhật vị trí
  const UPDATE_INTERVAL = 3 
  // khoảng cách ~m tối thiểu giữa hai vị trí mới để cập nhật
  const DISTANCE_THRESHOLD = 2 
  // hàm để cập nhật vị trí
  let trackingUserLocation
  const [isTrackingUserMode, setIsTrackingUserMode] = useState(false)

  useEffect(() => {
    if (route.params?.place_id) {
      if (Platform.OS === 'ios') {
        handleGetPlaceDetails(route.params.place_id, false)
      } else if (Platform.OS === 'android') {
        handleGetPlaceDetails(route.params.place_id, true)
      }
    } else if (route.params?.array_place_id) {
      setPlacesTextSearch([])
      setPlaceDetails(null)
      if (route.params?.array_place_id.length > 0) {
        const data = {
          arrayPlaceId: route.params.array_place_id,
          fields: MAP_PLACES_CARD_DATA_FIELDS
        }
  
        getPlacesByIdAPI(data).then((dataReturn) => {
          // console.log("🚀 ~ file: MapScreen.jsx:286 ~ getPlacesByIdAPI ~ dataReturn:", dataReturn)
          if (dataReturn.nextPageToken) {
            // console.log("Có nextPageToken", dataReturn.nextPageToken)
            setNextPageToken(dataReturn.nextPageToken)
          }
          else {
            // console.log("K Có nextPageToken")
            setNextPageToken(null)
          }
    
          if (dataReturn.arrPlace) {
            // Đặt giá trị cho placesTextSearch
            setPlacesTextSearch(dataReturn.arrPlace)
            // Ẩn thằng bottomSheet đi
            setIsOpenBottomSheet(false)
            // Show thằng scroll card 
            setIsShowScrollCardPlace(true)
            
            // Show thằng back icon 
            // setIsShowBackIcon(true)
            // Đặt kết quả tìm kiếm là addressText 
            // setPreviousTextSearch(addressText)
  
            setIsModeScrollOn(true)
  
            // Nơi đến bằng null
            setDestination(null)
            // Xóa PlaceDetails nếu như trước đó có 1 điểm đã đucợ chọn trc
            setPlaceDetails(null)
            // Không focus vào thnagừ search bar nữa
            inputRef.current?.blur()
            
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
              top: 130,
              right: 70,
              bottom: 150,
              left: 70
            }
      
            handleFitCoors(arrPlace, edgePadding, true)
            setArrPlaceToFitCoor(arrPlace)
          } else {
            dispatch(updateNotif({
              appearNotificationBottomSheet: true,
              contentNotificationBottomSheet: contentNotificationBottomSheet
            }))
          }
        })
      } else {
        dispatch(updateNotif({
          appearNotificationBottomSheet: true,
          contentNotificationBottomSheet: 'Xin lỗi địa điểm này chưa có trên bản đồ!'
        }))
      }
    } else if (route.params?.fromScreen === 'ChatBotScreen') {
      if (route.params?.condition === 'VIEW_ALL_PLACES_ON_MAIN_MAP') {
        // params = {
        //   fromScreen: 'ChatBotScreen',
        //   isFullScreen: boolean,
        //   condition: 'VIEW_ALL_PLACES_ON_MAIN_MAP',
        //   data: {
        //     placeTextSearch: array,
        //     nextPageToken: string,
        //     query: string,
        //     arrPlaceToFitCoor: array,
        //     divertDataToChatBot: function
        //   },
        // }
        setIsModeScrollOn(true)
        Keyboard.dismiss()
        // Đặt giá trị cho placesTextSearch
        setPlacesTextSearch(route.params?.data?.placeTextSearch)
        setNextPageToken(route.params?.data?.nextPageToken)
        // Ẩn thằng bottomSheet đi
        setIsOpenBottomSheet(false)
        // Show thằng scroll card 
        setIsShowScrollCardPlace(true)
        // Show thằng back icon 
        setIsShowBackIcon(true)
        // Đặt kết quả tìm kiếm là addressText 
        // setPreviousTextSearch(route.params?.data?.placeTextSearch)
        // Nơi đến bằng null
        setDestination(null)
        // Xóa PlaceDetails nếu như trước đó có 1 điểm đã đucợ chọn trc
        setPlaceDetails(null)
        // Không focus vào thnagừ search bar nữa
        inputRef.current?.blur()
  
        const edgePadding = {
          top: 130,
          right: 70,
          bottom: 150,
          left: 70
        }
  
        handleFitCoors(route.params?.data?.arrPlaceToFitCoor, edgePadding, true)
        setArrPlaceToFitCoor(route.params?.data?.arrPlaceToFitCoor)
      } else if (route.params?.condition === 'VIEW_ALL_DIRECTIONS_ON_MAIN_MAP') {
        // params = {
        //   fromScreen: 'ChatBotScreen',
        //   isFullScreen: boolean,
        //   condition: 'VIEW_ALL_DIRECTIONS_ON_MAIN_MAP',
        //   data: {
        //     directionsPolyLine: array,
        //     dataTime: {
        //       days: number,
        //       hours: number,
        //       minutes: number,
        //       seconds: number
        //     },
        //     distance: number,
        //     textOrigin: string,
        //     textDestination: string,
        //     directionOriPlaceId: string,
        //     directionDesPlaceId: string,
              // oriRouteInfo: string, 
              // desRouteInfo: string
        //   },
        // }


        // setOrigin(prev => route.params?.data?.directionsPolyLine[0])
        // setDestination(prev => route.params?.data?.directionsPolyLine[directionsPolyLine.length -1])
        // setDirectionsPolyLine(prev => route.params?.data?.directionsPolyLine)

        // setShowDirections(true)
        // setIsShowOptionRoute(false)

        // setTextOrigin(route.params?.data?.textOrigin)
        // setTextDestination(route.params?.data?.textDestination)

        // setShowDirections(true)
        // setDestination(route.params?.data?.directionsPolyLine[directionsPolyLine.length -1])
        // setIsModeScrollOn(false)

        // setIsOpenBottomSheet(false)

        // setDirectionModeGCP('DRIVE')
        // setDirectionModeORS('driving-car')
        // setTagModeSelected('1')

        // setDirectionOriPlaceId(route.params?.data?.directionOriPlaceId)
        // setDirectionDesPlaceId(route.params?.data?.directionDesPlaceId)

        // setSelectedPolyLine(0)
        // const edgePadding = {
        //   top: 330,
        //   right: 40,
        //   bottom: 150,
        //   left: 40
        // }
        // handleFitCoors(route.params?.data?.directionsPolyLine[0]?.polyline, edgePadding, true)
        // // Hiển thị ngày giờ và khoảng cách
        // setDistance(route.params?.data?.distance)
        // setDays(route.params?.data?.dataTime.days)
        // setHours(route.params?.data?.dataTime.hours)
        // setMinutes(route.params?.data?.dataTime.minutes)
        // setSeconds(route.params?.data?.dataTime.seconds)

        let coorOri, coorDes 
        const oriRouteInfo = route.params?.data?.oriRouteInfo
        if (oriRouteInfo) {
          coorOri = {
            latitude: oriRouteInfo.geometry.location.lat,
            longitude: oriRouteInfo.geometry.location.lng
          }
        }

        const desRouteInfo = route.params?.data?.desRouteInfo
        if (desRouteInfo) {
          coorDes = {
            latitude: desRouteInfo.geometry.location.lat,
            longitude: desRouteInfo.geometry.location.lng
          }
        }

        setShowDirections(true)

        setOriRouteInfo(oriRouteInfo ? oriRouteInfo  : arrPlaceInput[0])
        setDesRouteInfo(desRouteInfo ? desRouteInfo  : arrPlaceInput[0])

        setOrigin(oriRouteInfo ? coorOri : locationCurrent)
        setTextOrigin(oriRouteInfo ? oriRouteInfo.name : 'Địa Điểm của tôi')

        setDestination(desRouteInfo ? coorDes : locationCurrent)
        setTextDestination(desRouteInfo ? desRouteInfo.name : 'Địa Điểm của tôi')
        
        oriInputRef.current?.setAddressText(oriRouteInfo ? oriRouteInfo.name : 'Địa Điểm của tôi')
        desInputRef.current?.setAddressText(desRouteInfo ? desRouteInfo.name : 'Địa Điểm của tôi')

        handleGetDirections(
          route.params?.data?.directionOriPlaceId, 
          route.params?.data?.directionDesPlaceId, 
          'place_id', 
          'place_id',  
          coorOri, 
          coorDes,
          'DRIVE', 
          'driving-car', 
          '1', 
          { avoidTolls: false, avoidHighways: false, avoidFerries: false }
        )
      }
    }
  }, [route])

  useEffect(() => {
    if (currentFilter.routes)
      setRoutesFilter(currentFilter.routes)
  }, [currentFilter.routes])

  useEffect(() => {
    if (currentMap.suggestions) {
      const places = []
      currentMap.suggestions.map((suggestion) => {
        places.push({
          description: suggestion.description,
          geometry: suggestion.geometry,
          place_id: suggestion.place_id
        })
      })
      setArrPlaceInputMainSearch(places)
      // console.log("🚀 ~ file: MapScreen.jsx:260 ~ useEffect ~ places:", places)
    }
  }, [currentMap.suggestions])

  useEffect(() => {
    // Nếu mà thằng location trong state nó tồn tại 
    if (currentMap.userLocation) {
      handleGetUserLocation()
    }
  }, [currentMap.userLocation])

  const handleGetUserLocation = async () => {
    // console.log('currentMap.userLocation', currentMap.userLocation)
    setOrigin(currentMap.userLocation)
    setLocationCurrent(currentMap.userLocation)
    setArrPlaceInput([
      {
        description: 'Địa điểm của tôi',
        geometry: { location: { lat: currentMap.userLocation.latitude, lng: currentMap.userLocation.longitude } },
      }
    ])
    setTextOrigin('Địa điểm của tôi')
    // call api mapuser
    // await getMapUserAPI({
    //   currentUserId: user?._id ? user._id : temporaryUserId,
    // }).then(res => {
    //   // console.log("🚀 ~ file: MapScreen.jsx:308 ~ res:", res)
    //   const dataToUpdate = {
    //     ...currentMap,
    //     places: res.places,
    //     suggestions: res.suggestions,
    //   }
    //   // console.log("============================================================================================")

    //   // console.log("🚀 ~ file: MapScreen.jsx:314 ~ dataToUpdate:", dataToUpdate)
    //   dispatch(updateCurrentMap(dataToUpdate))
    // })
    // call api weather
    await getWeatherCurrentAPI(currentMap.userLocation).then(weatherData => {
      setWeather(weatherData)
    })
  }
  
  useEffect(() => {
    //  Này để thêm mảng để hiện lên polyline (đường biên giới)
    const arrCoor = coordinates.geometries[0].coordinates[0][0]
    let arrLatLng = []
    arrCoor.map(coor => {
      let latlngObj = {
        latitude: coor[1],
        longitude: coor[0]
      }
      arrLatLng.push(latlngObj)
    })
    setCurrentCoorArr(arrLatLng)

    // Lắng nghe sự kiện từ server (tracking location)
    socketIoInstance.on('s_tracking_user_location_current', (data) => {
      if (data.isCallNewApi) {
        const coordinates = data.coorArrDirection.features[0].geometry.coordinates
        const summary = data.coorArrDirection.features[0].properties.summary
        const bbox = data.coorArrDirection.features[0].bbox
        const arrDirection = coordinates.map(([longitude, latitude]) => ({ latitude, longitude }))
        setCoorArrDirection(arrDirection)

        // const edgePadding = {
        //   top: 300,
        //   right: 70,
        //   bottom: 130,
        //   left: 70
        // }
  
        // handleFitCoors(arrDirection, edgePadding, true)
        
        setDistance((summary.distance / 1000).toFixed(2)) // ~ km
        const minuttesTranformYet = summary.duration // ~ minutes

        const days = Math.floor(minuttesTranformYet / 1440)
        const hours =  Math.floor((minuttesTranformYet - (days * 1440)) / 60)
        const minutes = Math.floor(minuttesTranformYet - (days * 1440) - (hours * 60))
        const seconds = Math.floor((minuttesTranformYet - (days * 1440) - (hours * 60) - minutes) * 60)

        setDays(days)
        setHours(hours)
        setMinutes(minutes)
        setSeconds(seconds)
      } else {
        setCoorArrDirection(data.coorArrDirection)
      }
    })
  }, [])

  const handleGetDirections = async (start, end, typeOri, typeDes, startCoor, endCoor, modeGCP, modeORS, tagModeId, routeModifiers) => {
    // console.log("MapScreen.jsx:258 ~ getDirections ~ call api")
    // data = {
    //   oriAddress: 'abc' || null,
    //   desAddress: 'abc' || null,
    //   oriPlaceId: sdgkl_27e921 || null,
    //   desPlaceId: sdgkl_27e921 || null,
    //   oriCoor: {
    //      longitude: 10.214290,
    //      latitude: 100.1283824
    // } || null,
    //   desCoor: {
    //      longitude: 10.214290,
    //      latitude: 100.1283824
    // } || null,
    //   modeORS: 'driving-car',
    //   modeGCP: 'driving',
    //   typeOri: 'place_id' || 'address' || 'coordinate',
    //   typeDes: 'place_id' || 'address' || 'coordinate',
    //   routeModifiers: {
    //   avoidTolls: false,
    //   avoidHighways: false,
    //   avoidFerries: false,
    //   avoidIndoor: false
    //   },
    //   languageCode: 'vi'
    // }
      
      await getRouteDirectionAPI({
        oriAddress: typeOri === 'address' ? start : null,
        desAddress: typeDes === 'address' ? end : null,
        oriPlaceId: typeOri === 'place_id' ? start : null,
        desPlaceId: typeDes === 'place_id' ? end : null,
        oriCoor: startCoor,
        desCoor: endCoor,
        modeORS: modeORS,
        modeGCP: modeGCP,
        typeOri: typeOri,
        typeDes: typeDes,
        routeModifiers: routeModifiers,
        // {
        //   avoidTolls: false,
        //   avoidHighways: false,
        //   avoidFerries: false,
        //   avoidIndoor: false
        // },
        languageCode: "vi"
      }).then(dataReturn => {
        // console.log("🚀 ~ file: MapScreen.jsx:357 ~ handleGetDirections ~ dataReturn:", dataReturn)
        if (dataReturn?.error) {
          dispatch(updateNotif({
            appearNotificationBottomSheet: true,
            contentNotificationBottomSheet: "This route is not supported or not found!"
          }))
        } else {
          setDirectionModeGCP(modeGCP)
          setDirectionModeORS(modeORS)
          setTagModeSelected(tagModeId)
          // console.log("🚀 ~ file: MapScreen.jsx:314 ~ handleGetDirections ~ dataReturn:", dataReturn.callFrom)
          
          if (dataReturn.callFrom === 'GCP') {
            
            setDirectionOriPlaceId(dataReturn.oriPlaceId)
            setDirectionDesPlaceId(dataReturn.desPlaceId)
            
            const edgePadding = {
              top: 330,
              right: 40,
              bottom: 150,
              left: 40
            }
            
            setDirectionsPolyLine(dataReturn.data?.routes)
            setSelectedPolyLine(0)
            // Cho nó focus vào 
  
            handleFitCoors(dataReturn?.data?.routes[0]?.polyline, edgePadding, true)
            // Hiển thị ngày giờ và khoảng cách
            handleDatetimeAndDistance(dataReturn?.data?.routes[0]?.distanceMeters, dataReturn?.data?.routes[0]?.staticDuration)
          } 
          // else if (data.callFrom === 'ORS') {
          //   let dataToUpdate = []
          //   data?.data?.features?.map(feature => {
          //     const steps = []
          //     feature.properties.segments[0].steps.map(step => {
          //       const childStep = {
          //         duration: step.distance,
          //         distance: step.duration,
          //         html_instructions: null,
          //         instructions: step.instruction,
          //         start_location: step.start_location,
          //         end_location: step.end_location,
          //         polyline: step.polyline
          //       }
          //       steps.push(childStep)
          //     })
          //     let childDataToUpdate = {
          //       duration: feature.properties.segments[0].duration,
          //       distance: feature.properties.segments[0].distance,
          //       overview_polyline: feature.geometry.coordinates,
          //       steps: steps
          //     }
          //     dataToUpdate.push(childDataToUpdate)
          //   })
  
          //   const edgePadding = {
          //     top: 300,
          //     right: 70,
          //     bottom: 130,
          //     left: 70
          //   }
          //   setDirectionsPolyLine(dataToUpdate)
          //   // Cho nó focus vào 
          //   handleFitCoors(dataToUpdate[0].overview_polyline.points, edgePadding, true)
          //   // Hiển thị ngày giờ và khoảng cách
          //   handleDatetimeAndDistance(dataToUpdate[0].distance, dataToUpdate[0].duration)
          // }
        }
      })
  }

  const handleDatetimeAndDistance = (distance, duration) => {
    setDistance((distance / 1000).toFixed(2)) // ~ km
    const secondsTranformYet = duration // ~ second

    const days = Math.floor(secondsTranformYet / 86400)
    const hours =  Math.floor((secondsTranformYet - (days * 86400)) / 3600)
    const minutes = Math.floor((secondsTranformYet - (days * 86400) - (hours * 3600)) / 60)
    const seconds = Math.floor((secondsTranformYet - (days * 86400) - (hours * 3600) - (minutes* 60)))

    setDays(days)
    setHours(hours)
    setMinutes(minutes)
    setSeconds(seconds)
  }

  // const handleAnimationPolyline = (coordinates) => {
  //   // console.log("🚀 ~ file: MapScreen.jsx:328 ~ handleAnimationPolyline ~ coordinates:", coordinates.length)
  //   let counter = 0
  //   setIsAnimating(true)
  //   const steps = Math.floor(coordinates.length / 30)
  //   // console.log("🚀 ~ file: MapScreen.jsx:332 ~ handleAnimationPolyline ~ steps:", steps)
  //   const intervalId = setInterval(() => {
  //     if (counter < coordinates.length) {
  //       const coordinatesToAdd = []
  //       for (let index = 1; index <= steps; index++) {
  //         if(coordinates[counter+index])
  //           coordinatesToAdd.push(coordinates[counter+index])
  //       }
  //       setCoorArrDirectionAnimation(prevCoords => [...prevCoords, ...coordinatesToAdd])
  //       counter+=steps
  //     } else {
  //       clearInterval(intervalId)
  //       setIsAnimating(false)
  //     }
  //   }, 1) // thêm mỗi tọa độ trong mảng sau mỗi 0.2 giây

  //   return () => {
  //     clearInterval(intervalId)
  //   }
  // }
  const handleStartTrackingUserLocation = async () => {
    // Chỉ bật khi mà người dùng bắt đầu tracking thôi 
      setIsTrackingUserMode(true)
      trackingUserLocation = await Location.watchPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: UPDATE_INTERVAL * 1000,
        distanceInterval: DISTANCE_THRESHOLD,
      }, (userLocation) => {
        // console.log("🚀 ~ file: MapScreen.jsx:294 ~ handleStartTrackingUserLocation ~ userLocation:", userLocation)
        const position = {
          latitude: userLocation.coords.latitude || 0,
          longitude: userLocation.coords.longitude || 0
        }
        setOrigin(position)
        setLocationCurrent(position)
        setArrPlaceInput([
          {
            description: 'Địa điểm của tôi',
            geometry: { location: { lat: userLocation.coords.latitude, lng: userLocation.coords.longitude } },
          }
        ])
      })
  }

  const handleRemoveTrackingUserLocation = () => trackingUserLocation.remove()

  useEffect(() => {
    if (isTrackingUserMode) {
      socketIoInstance.emit('c_tracking_user_location_current', {
        currentUserId: user ? user._id : temporaryUserId,
        location: origin,
        coorArrDirection: coorArrDirection,
        profile: 'driving-car',
        destination: destination
      })
    }
  }, [origin])

  const [isShowRefreshCard, setIsShowRefreshCard] = useState(false)
  const mapRef = useRef(null)
  const cardScrollViewRef = useRef(null)
  
  const loadMoreCardDebouncer = useMemo(() => debounce(
    () => { handleLoadingMoreCard()}, 500),
    [handleLoadingMoreCard, nextPageToken, placesTextSearch], 
  )

  const [mapIndex, setMapIndex] = useState(0)
  let loadingRefreshCard = false
  // eslint-disable-next-line prefer-const
  let mapAnimation = new Animated.Value(-27.3333)

  const handleLoadingMoreCard = () => {
    // console.log("Loading more")
    if (nextPageToken && !loadingRefreshCard) {
      loadingRefreshCard = true
      let data
      if (route.params?.fromScreen === 'ChatBotScreen' && route.params?.condition === 'VIEW_ALL_PLACES_ON_MAIN_MAP') {
        data = {
          query: route.params?.data?.query,
          sortBy: 'DEFAULT',
          radius: '5000',
          location: currentFilter.location || locationCurrent,
        }
      } else {
        data = {
          query: inputRef.current.getAddressText(),
          sortBy: currentFilter.sortBy,
          radius: currentFilter.radius,
          location: currentFilter.location || locationCurrent,
          pagetoken: nextPageToken
        }
    
        if (currentFilter.priceLevels[0] !== 0 || currentFilter.priceLevels[1] !== 5) {
          data = {
            ...data,
            minprice: currentFilter.priceLevels[0].toString(),
            maxprice: currentFilter.priceLevels[1].toString()
          }
        }
    
        if (currentFilter.category !== FilterConstants.categories.ALL_CATEGORIES) {
          data = {
            ...data,
            type: currentFilter.category
          }
        }
      }

      getMorePlacesTextSearchAPI(data).then((dataReturn) => {
        // console.log("duwx lieeuj trar về")
  
        if (dataReturn.nextPageToken){
          // console.log("Có nextPageToken")
          setNextPageToken(dataReturn.nextPageToken)
        } else {
          // console.log(" k Có nextPageToken")
          setNextPageToken(null)
        }

        if (dataReturn.arrPlace) {
          setPlacesTextSearch([
            ...placesTextSearch,
            ...dataReturn.arrPlace
          ])
          // console.log("Có dataReturn.arrPlace")
        } else {
          // console.log("K Có dataReturn.arrPlace")

        }
        setIsShowRefreshCard(false)
        loadingRefreshCard = false

        if (route.params?.fromScreen === 'ChatBotScreen' && route.params?.condition === 'VIEW_ALL_PLACES_ON_MAIN_MAP') {
          route.params?.data?.divertDataToChatBot({
            nextPageToken: dataReturn.nextPageToken ? dataReturn.nextPageToken : null,
            placeTextSearchMore: dataReturn.arrPlace ? dataReturn.arrPlace : []
          })
        }
      }).catch(err => {
        setIsShowRefreshCard(false)
        loadingRefreshCard = false
      })
  
      
    } else {
      setIsShowRefreshCard(false)
      loadingRefreshCard = false
      toast.show("There's nowhere to load more!")
    }
  }
  
  useEffect(() => {
    if (placesTextSearch) {
      mapAnimation.addListener(({ value }) => {
        // // console.log("🚀 ~ file: MapScreen.jsx:279 ~ mapAnimation.addListener ~ value:", value)
        // animate 30% away from landing on the next item
        let index = Math.floor((value / (CARD_WIDTH + 20)) + 0.3)
  
        if (value >= (placesTextSearch.length - 1) * 320 && !loadingRefreshCard) {
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

  useEffect(() => {
    if (isShowScrollCardPlace)
      cardScrollViewRef.current.scrollTo({ x: -27.3333, y: 0, animated: true })
  }, [isShowScrollCardPlace])

  useEffect(() => {
    return () => {
      loadMoreCardDebouncer.cancel()
    }
  }, [])

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

  const handleFitCoors = (arrPlace ,edgePadding, haveAnimate) => {
    mapRef.current?.fitToCoordinates(
      arrPlace,
      { edgePadding: edgePadding },
      haveAnimate
    )
  }
  
  const onPlaceSelected = (details, flag) => {
    const set = (flag === 'origin') ? setOrigin : setDestination
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0
    }
    set(position)
    setIsShowBackIcon(true)
    setIsOpenBottomSheet(true)
    setArrImgBase64([])
    setIsShowScrollCardPlace(false)
    setPlaceDetails(details)
    inputRef.current?.setAddressText(details?.name)
    
    setIsModeScrollOn(false)
    setArrImgBase64([details.photos])
    // moveToMap(position, 16)

    const arrPlace = [
      {
        latitude: details.geometry.viewport.northeast.lat,
        longitude: details.geometry.viewport.northeast.lng,
      },
      {
        latitude: details.geometry.viewport.southwest.lat,
        longitude: details.geometry.viewport.southwest.lng,
      }
    ]
    const edgePadding = {
      top: 0,
      right: 70,
      bottom: 180,
      left: 70
    }
    handleFitCoors(arrPlace, edgePadding , true)
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

  const handleRoutePress = (locationDes, desPlaceId) => {
    setShowDirections(true)
    setDestination(locationDes)
    setIsModeScrollOn(false)
    // Clone lại
    setPlaceDetailsClone(placeDetails)
    setIsOpenBottomSheet(false)
    // TH định vị chauw bắt kịp
    if (!origin) {
      setIsShowOptionRoute(true)
    } else {
      let routeModifiers
      if (directionModeGCP === 'DRIVE' || directionModeGCP === 'TWO_WHEELER') {
        
        routeModifiers = {
          avoidTolls: routesFilter.find(item => item.id === 'avoidTolls').value,
          avoidHighways: routesFilter.find(item => item.id === 'avoidHighways').value,
          avoidFerries: routesFilter.find(item => item.id === 'avoidFerries').value
        }
      } else if (directionModeGCP === 'WALK') {
        routeModifiers = {
          avoidIndoor: routesFilter.find(item => item.id === 'avoidIndoor').value
        }
      } 
      else if (directionModeGCP === 'BICYCLE') {
        routeModifiers = null
      }
      handleGetDirections(origin, desPlaceId, 'coordinate', 'place_id', origin, locationDes, directionModeGCP, directionModeORS, tagModeSelected, routeModifiers)
    }
  }

  const handleGetPlaceDetails = (placeId, androidPoiClick) => {
    // // console.log("🚀 ~ file: MapScreen.jsx:273 ~ handleGetPlaceDetails ~ e", e.nativeEvent.placeId)
    const data = {
        placeId: placeId,
        androidPoiClick: androidPoiClick
      }
    // // console.log("🚀 ~ file: MapScreen.jsx:277 ~ handleGetPlaceDetails ~ data", data)
    getPlaceDetailsAPI(data).then((placeDetails) => {
      // // console.log("🚀 ~ file: MapScreen.jsx:279 ~ getPlaceDetailsAPI ~ placeDetails", placeDetails)
      placeDetails.isTranformData = true
      onPlaceSelected(placeDetails, 'destination')
    })
  }

  const handleGetPlacesSearchText = (addressText) => {
    let data = {
      query: addressText,
      sortBy: currentFilter.sortBy,
      radius: currentFilter.radius,
      location: currentFilter.location || locationCurrent,
    }

    if (currentFilter.priceLevels[0] !== 0 || currentFilter.priceLevels[1] !== 5) {
      data = {
        ...data,
        minprice: currentFilter.priceLevels[0].toString(),
        maxprice: currentFilter.priceLevels[1].toString()
      }
    }

    if (currentFilter.category !== FilterConstants.categories.ALL_CATEGORIES) {
      data = {
        ...data,
        type: currentFilter.category
      }
    }

    getPlacesTextSearchAPI(data).then((dataReturn) => {
      if (dataReturn.nextPageToken) {
        // console.log("Có nextPageToken", dataReturn.nextPageToken)
        setNextPageToken(dataReturn.nextPageToken)
      }
      else {
        // console.log("K Có nextPageToken")
        setNextPageToken(null)
      }

      if (dataReturn.arrPlace) {
        // Đặt giá trị cho placesTextSearch
        setPlacesTextSearch(dataReturn.arrPlace)
        // Ẩn thằng bottomSheet đi
        setIsOpenBottomSheet(false)
        // Show thằng scroll card 
        setIsShowScrollCardPlace(true)
        // Show thằng back icon 
        setIsShowBackIcon(true)
        // Đặt kết quả tìm kiếm là addressText 
        setPreviousTextSearch(addressText)
        // Nơi đến bằng null
        setDestination(null)
        // Xóa PlaceDetails nếu như trước đó có 1 điểm đã đucợ chọn trc
        setPlaceDetails(null)
        // Không focus vào thnagừ search bar nữa
        inputRef.current?.blur()
        
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
          top: 130,
          right: 70,
          bottom: 150,
          left: 70
        }
  
        handleFitCoors(arrPlace, edgePadding, true)
        setArrPlaceToFitCoor(arrPlace)
      } else {
        dispatch(updateNotif({
          appearNotificationBottomSheet: true,
          contentNotificationBottomSheet: contentNotificationBottomSheet
        }))
      }
    })
  }

  const handleShareButton = (urlPhoto) => {
    const message = `Hãy khám phá ${placeDetails?.name} cùng mình nha!`
    const url = urlPhoto
    const title = 'DongNaiTravelApp'
    FunctionsUtility.shareImageToSocial(message, url, title)
  }

  return (
    <>
      {/* <View style={styles.headerBox}>
        <Text style={styles.headerText}>Map</Text>
      </View> */}
      <MapViewWithHeading
        mapRef={mapRef}
        style={styles.map}
        mapType={currentMap.mapTypes}
        showsTraffic={currentMap.mapDetails}
        provider={PROVIDER_GOOGLE}
        showsIndoors={false}
        initialRegion={INITIAL_POSITION}
        showsUserLocation={locationCurrent ? true : false}
        followsUserLocation
        toolbarEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        onPoiClick={e => {
          if (!showDirections) {
            // console.log("🚀 ~ file: MapScreen.jsx:930 ~ e.nativeEvent.placeId:", e.nativeEvent.placeId)
            if (Platform.OS === 'ios') {
              handleGetPlaceDetails(e.nativeEvent.placeId, false)
            } else if (Platform.OS === 'android') {
              handleGetPlaceDetails(e.nativeEvent.placeId, true)
            }
          }
        }}
        
        onLongPress={(e) => {
          setMarkerLongPress(e.nativeEvent.coordinate)
        }}

        onPress={(e) => {
          setMarkerLongPress(null)
        }}
        mapPadding={{
          top: 0,
          right: 0,
          bottom: isModeScrollOn ? 160 : 0,
          left: 0
        }}
      >

        {markerLongPress && (
          <Marker coordinate={markerLongPress} />
        )}

        {
        (origin && showDirections && (textDestination === 'Địa điểm của tôi' || textOrigin !== 'Địa điểm của tôi')) ? 
        <Marker 
          coordinate={origin}
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
          
        </Marker> : null
        }

        {/* Show my result when I search location */}
        {destination ? <Marker coordinate={destination} /> : null}

        {/* Show all place I saved */}
        {
          (currentMap.places.length !== 0 && !placeDetails && !showDirections) ? 
          currentMap.places.map(place => {
            return (
              <Marker 
                key={place.place_id}
                coordinate={place.coordinate}
                // icon={{uri: place.icon}}
                // pinColor={'white'}
                tappable={true}
                onPress={() => {handleGetPlaceDetails(place.place_id, false)}}
              >
                <View>
                  <FontAwesome5 name="map-marker" size={30} color={app_c.HEX.third} style={{height: 30}}/>
                  <FontAwesome name="suitcase" size={12} color={app_c.HEX.primary} style={{ position: 'absolute', top: 6, right: 5, height: 30}}/>
                </View>
              </Marker>
            )
          })
          : null
        }

        <Polyline
          coordinates={currentCoorArr}
          strokeWidth={1}
          strokeColor="#F85454"
        />
        
        {/* Polyline chính + phụ */}
        {
          (directionsPolyLine && showDirections && origin && destination ) ? 
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
                    if (isShowDirectionsBottomSheet)
                      edgePadding = {
                        top: 30,
                        right: 150,
                        bottom: 400,
                        left: 150
                      }
                    else 
                      edgePadding = {
                        top: 330,
                        right: 40,
                        bottom: 150,
                        left: 40
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

        {/* Polyline cho việc hiển thị arrow*/}
        {
          (stepPolyLine.length > 0) &&
          <ArrowedPolyline
            coordinates={stepPolyLine}
            strokeWidth={8}
            strokeColor='#32CD32'
            style={{ zIndex: 3}}
            addOnlyLastArrow={true}
            arrowSize={20}
          />
        }
        
        {/* Arr marker show on map view */}
        {
          (placesTextSearch && !showDirections && !isOpenBottomSheet) ? 
          placesTextSearch.map((place, index) => {
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
          }) : 
          null
        }
      </MapViewWithHeading>

      {/* Phuong: click outside inputautocomplete */}
      {
        isFocusedInput &&
          <Pressable
          style={styles.overlayBtn}
          onPress={() =>{
            setIsFocusedInput(false)
            inputRef.current?.blur()
          }}
        />
      }

      {/* Phuong: click outside inputautocomplete in route label */}
      {
        (isFocusedDesInput || isFocusedOriInput) &&
          <Pressable
          style={styles.overlayBtn}
          onPress={() => {
            setIsFocusedOriInput(false)
            setIsFocusedDesInput(false)
            oriInputRef.current?.blur()
            desInputRef.current?.blur()
          }}
        />
      }

      {/* Phuong: Tag list */}
      {
        (!isShowDirectionsBottomSheet && isShowRoutePanel) &&
        <ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          height={40}
          style={styles.tagList}
          // Phương: Only Ios
          contentInset={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 25
          }}
          // Phương: For android
          contentContainerStyle={{
            paddingRight: Platform.OS === 'android' ? 25 : 0
          }}
        >
          {
            typemapsearch.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.tagContainer, {
                  backgroundColor: tagSelected === item.id ? app_c.HEX.third : app_c.HEX.primary
                }]}
                onPress={() => {
                  setTagSelected(item.id)
                  dispatch(updateNotif({
                    appearNotificationBottomSheet: true,
                    contentNotificationBottomSheet: "Xin lỗi chức năng này sẽ có trong bản cập nhật tiếp theo!"
                  }))
                }}
              >
                <Text style={[styles.tagText, {
                  color: tagSelected === item.id ? app_c.HEX.primary : app_c.HEX.fourth
                }]}
                >
                  {item.title[langCode]}
                </Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      }

      {/* Stack map */}
      {
        (!isShowWeatherBottomSheet && !isShowScrollCardPlace && !isOpenBottomSheet && !isShowDirectionsBottomSheet && !showDirections) &&
        <TouchableOpacity
          style={[styles.circleBtn, {
            backgroundColor: app_c.HEX.third,
            marginTop: 10,
            position: 'absolute',
            top: 120,
            right: 0,
            width: 40,
            height: 40
          }]}
          onPress={() => {
            setIsShowMapTypeBottomSheet(true)
          }}
        >
          <Octicons 
            name='stack' 
            size={20} 
            color={app_c.HEX.primary}
          />
        </TouchableOpacity>
      }

      

      {/* Phuong: Search bar */}
      {
        (!isShowDirectionsBottomSheet && isShowRoutePanel) && 
        <View style={styles.seachTypeContainer}>
          {/* <TouchableOpacity style={{
            left: 18,
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            ...app_shdw.type_2,
            marginBottom: 10,
          }}>
             <Ionicons name="chevron-back-outline" size={18} color={app_c.HEX.third}/>
          </TouchableOpacity> */}
          <View style={styles.searchContainer}>
            <InputAutoComplete
              onPlaceSelected={(details) => {
                // console.log("🚀 ~ file: MapScreen.jsx:1261 ~ details:", details?.place_id)
                Keyboard.dismiss()
                handleGetPlaceDetails(details.place_id, false)
                // onPlaceSelected(details, 'destination')
              }}
              predefinedPlaces={arrPlaceInputMainSearch}
              isFocusedInput={isFocusedInput}
              handleFocus={(condition) => setIsFocusedInput(condition)}
              inputRef={inputRef}
              map_api_key={map_api_key}
              handleGetAddressText={(addressText) => {
                Keyboard.dismiss()
                handleGetPlacesSearchText(addressText)
              }}
              placeholder={langData.find_placeholder[langCode]}
              isShowBackIcon={isShowBackIcon}
              isHaveRightButton={true}
              handlePressFilter={() => setIsOpenBottomSheetFilter(true)}
              handlePressBackIcon={() => {
                // TH1: Khi user click vào 1 địa điểm ngay từ đầu
                if (!placesTextSearch && placeDetails) {
                  setIsShowBackIcon(false)
                  setIsOpenBottomSheet(false)
                  setPlaceDetails(null)
                  setDestination(null)
                  setPlacesTextSearch(null)
                  inputRef.current?.clear()
                }
                // TH2: Khi user click vào tìm kiếm nhiều địa điểm ngay từ đầu
                else if (placesTextSearch && !placeDetails) {
                  setIsShowBackIcon(false)
                  setIsShowScrollCardPlace(false)
                  setPlacesTextSearch(null)
                  setPlaceDetails(null)
                  setDestination(null)
                  inputRef.current?.clear()
                }
                // TH3: Khi người dùng search nheièu địa điểm và tìm trên bản đồ 1 địa điểm khác
                else if (placesTextSearch && placeDetails) {
                  setIsOpenBottomSheet(false)
                  setPlaceDetails(null)
                  setDestination(null)
                  inputRef.current?.setAddressText(previousTextSearch)
                }
                setDirectionsPolyLine([])
                setSelectedPolyLine(0)
              }}
            />
          </View>
        </View>
      }

      {/* Route's infomation */}
     {
      (showDirections && isShowRoutePanel) &&
      <>
        <View style={styles.containerRouteInfo}>
          <TouchableOpacity 
            onPress={() => {
              if (!placeDetails && !placesTextSearch) {
                if (origin && destination && isShowOptionRoute) {
                  setIsShowOptionRoute(false)
                } else {
                  setShowDirections(false)
                  setIsShowOptionRoute(false)

                  setDestination(null)
                  setTextDestination('')

                  setOrigin(locationCurrent)
                  setTextOrigin('Địa điểm của tôi')

                  setOriRouteInfo(null)
                  setDesRouteInfo(null)
                }
              } else {
                if (isShowOptionRoute) {
                  setIsShowOptionRoute(false)
                } else {
                  // TH1: Nếu user click từ bottom sheet hoặc user click từ bottom sheet từ scrool card
                  if ((placeDetails && !placesTextSearch) || (placeDetails && placesTextSearch)) {
                    setShowDirections(false)
                    setIsOpenBottomSheet(true)
                    const arrPlace = [
                      {
                        latitude: placeDetailsClone.geometry.viewport.northeast.lat,
                        longitude: placeDetailsClone.geometry.viewport.northeast.lng,
                      },
                      {
                        latitude: placeDetailsClone.geometry.viewport.southwest.lat,
                        longitude: placeDetailsClone.geometry.viewport.southwest.lng,
                      }
                    ]
                    const edgePadding = {
                      top: 0,
                      right: 70,
                      bottom: 180,
                      left: 70
                    }
                    handleFitCoors(arrPlace, edgePadding , true)
                    setDestination({
                      latitude: placeDetailsClone?.geometry.location.lat,
                      longitude: placeDetailsClone?.geometry.location.lng
                    })
                    // Mình phải set lại những tt trước đó trong bottom sheet
                    setPlaceDetails(placeDetailsClone)
                  } else if (!placeDetails && placesTextSearch) {
                    // TH2: Nếu user click từ scrool card
                    setShowDirections(false)
                    const edgePadding = {
                      top: 130,
                      right: 70,
                      bottom: 150,
                      left: 70
                    }
                    handleFitCoors(arrPlaceToFitCoor, edgePadding, true)
                    setDestination(null)
                  }
                  // Đặt lại giá trị
                  setTextOrigin('Địa điểm của tôi')
                  setOrigin(locationCurrent)
                  
                }
              }
            }}
            style={styles.backbtn}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={18}
              color={app_c.HEX.ext_second}
              style={styles.iconBack}
            />
          </TouchableOpacity>
          <Text style={styles.headerRouteInfo}>{langData.your_router[langCode]}</Text>
          {
            isShowOptionRoute &&
            <TouchableOpacity 
              onPress={() => {
                setIsShowFilterDirectionBottomSheet(true)
              }}
              style={styles.settingBtn}
            >
              <MaterialIcons
                name="settings"
                size={20}
                color={app_c.HEX.ext_second}
              />
            </TouchableOpacity>
          }
          {
            !isShowOptionRoute ? 
              <View style={styles.frameRouteInfo}>
                <View style={styles.leftContainerFrame}>
                  <TouchableOpacity 
                    onPress={() => {
                      let ori = origin
                      let des = destination
                      const currentOriText = textOrigin
                      const currentDesText = textDestination

                      setOrigin(des)
                      setDestination(ori)

                      const temp2 = textOrigin
                      setTextOrigin(textDestination)
                      setTextDestination(temp2)

                      if (!oriRouteInfo || !desRouteInfo) {
                        if (currentOriText === 'Địa điểm của tôi') {
                          setOriRouteInfo(desRouteInfo)
                          setDesRouteInfo(arrPlaceInput[0])
                        } else if (currentDesText === 'Địa điểm của tôi') {
                          setDesRouteInfo(oriRouteInfo)
                          setOriRouteInfo(arrPlaceInput[0])
                        } else {
                          const temp = oriRouteInfo
                          setOriRouteInfo(desRouteInfo)
                          setDesRouteInfo(temp)
                        }
                      } else {
                        const temp = oriRouteInfo
                        setOriRouteInfo(desRouteInfo)
                        setDesRouteInfo(temp)
                      }

                      const routeModifiers = {
                        avoidTolls: routesFilter.find(item => item.id === 'avoidTolls').value,
                        avoidHighways: routesFilter.find(item => item.id === 'avoidHighways').value,
                        avoidFerries: routesFilter.find(item => item.id === 'avoidFerries').value,
                        avoidIndoor: routesFilter.find(item => item.id === 'avoidIndoor').value
                      }

                      handleGetDirections(directionDesPlaceId, directionOriPlaceId, 'place_id', 'place_id', des, ori, directionModeGCP, directionModeORS, tagModeSelected, routeModifiers)
                    }}
                    style={styles.changeOriDes}
                  >
                    <Octicons
                      name='arrow-switch' 
                      size={15} 
                      color={app_c.HEX.ext_second}
                      style={{transform: [{ rotate: '90deg'}]}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setIsShowOptionRoute(true)
                    // console.log(placeDetails?.name)
                  }}>
                    <Text numberOfLines={2} style={styles.originText}>{textOrigin}</Text>
                  </TouchableOpacity>
                  <Text style={styles.toText}>{langData.to[langCode]}</Text>
                  <TouchableOpacity onPress={() => setIsShowOptionRoute(true)}>
                    <Text numberOfLines={2} style={styles.detinationText}>{textDestination}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rightContainerFrame}>
                  <View style={styles.rightContainerFrameInto}>
                    <View style={styles.routeInfoTimeContainer}>
                      <View style={styles.routeInfoUnixTime}>
                        <Text style={styles.routeInfoNumberTime}>{days === 0 ? '-' : days}</Text>
                        <Text style={styles.routeInfoTextTime}>{days > 1 ? langData.days[langCode]: langData.day[langCode]}</Text>
                      </View>
                      <View style={styles.routeInfoUnixTime}>
                        <Text style={styles.routeInfoNumberTime}>{hours === 0 ? '-' : hours}</Text>
                        <Text style={styles.routeInfoTextTime}>{hours > 1 ? langData.hours[langCode] : langData.hour[langCode]}</Text>
                      </View>
                      <View style={styles.routeInfoUnixTime}>
                        <Text style={styles.routeInfoNumberTime}>{minutes === 0 ? '-' : minutes}</Text>
                        <Text style={styles.routeInfoTextTime}>{minutes > 1 ? langData.mins[langCode] : langData.min[langCode]}</Text>
                      </View>
                    </View>
                    <View style={styles.routeInfoTranportContainer}>
                      <Text style={styles.routeInfoTranport}>{directionModeGCP === 'DRIVE' ? 'Xe hơi' : (directionModeGCP === 'TWO_WHEELER' ? 'Mô tô' : (directionModeGCP === 'WALK' ? 'Đi bộ' :  (directionModeGCP === 'BICYCLE' ? 'Xe đạp' : 'Trung chuyển')))}</Text>
                      <Text style={styles.routeInfoTextTranport}>{langData.by[langCode]}</Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.distanceText, {marginTop: Platform.OS === 'ios' ? 15 : 5, marginBottom: Platform.OS === 'ios' ? 10 : 5}]}>{langData.summary[langCode]}: {distance}km</Text>

                  <View style={styles.containerBtnOptionRoute}>
                    <TouchableOpacity 
                      onPress={() => {
                        setIsShowRoutePanel(false)
                        setIsShowDirectionsBottomSheet(true)
                        
                        const edgePadding = {
                          top: 30,
                          right: 150,
                          bottom: 400,
                          left: 150
                        }

                        handleFitCoors(directionsPolyLine[selectedPolyLine]?.polyline, edgePadding, true)
                      }}
                      style={[styles.btnStart, {
                        backgroundColor: app_c.HEX.ext_second
                      }]}
                    >
                      <Text style={styles.textStart}>{langData.direction[langCode]}</Text>
                      <FontAwesome5 
                        name='list-ul'
                        size={12} 
                        color={app_c.HEX.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => {
                        // handleStartTrackingUserLocation()
                        dispatch(updateNotif({
                          appearNotificationBottomSheet: true,
                          contentNotificationBottomSheet: "Xin lỗi chức năng này sẽ có trong bản cập nhật tiếp theo!"
                        }))
                      }}
                      style={[styles.btnStart, {marginLeft: 12}]}
                    >
                      <Text style={styles.textStart}>{langData.start[langCode]}</Text>
                      <FontAwesome5 
                        name='location-arrow'
                        size={12} 
                        color={app_c.HEX.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View> :
            <View style={styles.optionalContainer}>
              <View style={styles.iconOriDesContainer}>
                <Ionicons
                  name="navigate-circle"
                  size={20}
                  color={app_c.HEX.third}
                />
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={20}
                  color={app_c.HEX.ext_second}
                  style={{
                    marginVertical: 5
                  }}
                />
                <Ionicons
                  name='location' 
                  size={20} 
                  color='#eb4141'
                />
              </View>
              <View style={styles.oriDesContainer}>
                <TouchableOpacity 
                  onPress={() => {
                    // console.log("🚀 ~ file: MapScreen.jsx:1066 ~ Map ~ textOrigin:", textOrigin)
                    // console.log("🚀 ~ file: MapScreen.jsx:887 ~ Map ~ oriRouteInfo:", oriRouteInfo)

                    let start, end, startCoor, endCoor, typeOri, typeDes
                    
                    // TH nếu 2 thằng đều không rỗng
                    if (desInputRef.current.getAddressText().trim() !== '' && oriInputRef.current.getAddressText().trim() !== '') {
                      if (oriInputRef.current.getAddressText().trim() === desInputRef.current.getAddressText().trim()) {
                        return
                      }
                      // Phải reset lại
                      setDirectionsPolyLine([])
                      setSelectedPolyLine(0)
                      // TH1 nếu nó không phải là Địa điểm của tôi
                      if (oriInputRef.current.getAddressText().trim() !== 'Địa điểm của tôi' && oriRouteInfo) {
                          if (oriRouteInfo.name)
                            setTextOrigin(oriRouteInfo.name)
                          else 
                            setTextOrigin(oriRouteInfo.description)
                          setOrigin({
                            latitude: oriRouteInfo?.geometry.location.lat,
                            longitude: oriRouteInfo?.geometry.location.lng
                          })
                          // lúc này chắc chắn trong oriRouteInfo là người dùng đã chọn từ phần gọi ý cho nên lấy ra place_id từ đó 
                          start = oriRouteInfo?.place_id
                          startCoor = {
                            latitude: oriRouteInfo?.geometry.location.lat,
                            longitude: oriRouteInfo?.geometry.location.lng
                          }
                          typeOri = 'place_id'
                      } else if (oriInputRef.current.getAddressText().trim() === 'Địa điểm của tôi') {
                        // console.log('TH ori banwg Địa điểm của tôi va khong co oriRouteInfo')
                        start = locationCurrent
                        typeOri = 'coordinate'
                        startCoor = locationCurrent

                        setTextOrigin('Địa điểm của tôi')
                        setOrigin(locationCurrent)
                      } 

                      // console.log("🚀 ~ file: MapScreen.jsx:1384 ~ Map ~ desInputRef.current.getAddressText().trim():", desInputRef.current.getAddressText().trim())
                      // console.log("🚀 ~ file: MapScreen.jsx:1383 ~ Map ~ desRouteInfo:", desRouteInfo)

                      if (desInputRef.current.getAddressText().trim() !== 'Địa điểm của tôi' && desRouteInfo) {
                        // console.log('TH des khong bang Địa điểm của tôi va co desRouteInfo')
                          if (desRouteInfo.name)
                            setTextDestination(desRouteInfo.name)
                          else 
                            setTextDestination(desRouteInfo.description)
                          setDestination({
                            latitude: desRouteInfo?.geometry.location.lat,
                            longitude: desRouteInfo?.geometry.location.lng
                          })
                          end = desRouteInfo?.place_id
                          endCoor = {
                            latitude: desRouteInfo?.geometry.location.lat,
                            longitude: desRouteInfo?.geometry.location.lng
                          }
                          typeDes = 'place_id'
                      }
                      else if (desInputRef.current.getAddressText().trim() === 'Địa điểm của tôi') {
                        // console.log('TH des la Địa điểm của tôi')
                        end = locationCurrent
                        typeDes = 'coordinate'
                        endCoor = locationCurrent
                        setDestination(locationCurrent)
                        setTextDestination('Địa điểm của tôi')
                      } 
                      setIsShowOptionRoute(false)
                      let routeModifiers
                      // console.log("🚀 ~ file: MapScreen.jsx:1542 ~ Map ~ tagModeSelected:", tagModeSelected)
                      if (directionModeGCP === 'DRIVE' || directionModeGCP === 'TWO_WHEELER') {
                        routeModifiers = {
                          avoidTolls: (routesFilter.find(item => item.id === 'avoidTolls')).value,
                          avoidHighways: (routesFilter.find(item => item.id === 'avoidHighways')).value,
                          avoidFerries: (routesFilter.find(item => item.id === 'avoidFerries')).value
                        }
                        // console.log("🚀 ~ file: MapScreen.jsx:1556 ~ Map ~ routeModifiers:", routeModifiers)
                      } else if (directionModeGCP === 'WALK') {
                        routeModifiers = {
                          avoidIndoor: routesFilter.find(item => item.id === 'avoidIndoor').value
                        }
                      } else if (directionModeGCP === 'BICYCLE') {
                        routeModifiers = null
                      }
                      handleGetDirections(start, end, typeOri, typeDes, startCoor, endCoor, directionModeGCP, directionModeORS, tagModeSelected, routeModifiers)
                    }
                  }}
                  style={styles.routeBtn}
                >
                      <Text style={styles.routeBtnText}>{langData.router_title[langCode]}</Text>
                </TouchableOpacity>
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0}}>
                  <InputAutoComplete
                    placeholder={langData.choose_a_des_place[langCode]}
                    onPlaceSelected={(details) => {
                      // if (!details.place_id) { 
                      //   setTextOrigin(details.description)
                      // }
                      setDesRouteInfo(details)
                      setIsFocusedDesInput(false)
                    }}
                    isFocusedInput={isFocusedDesInput}
                    handleFocus={(condition) => setIsFocusedDesInput(condition)}
                    inputRef={desInputRef}
                    map_api_key={map_api_key}
                    predefinedPlaces={[...arrPlaceInput, ...arrPlaceInputMainSearch]}
                    predefinedPlacesDescriptionStyle={styles.predefinedPlacesDescription}
                    // handleGetAddressText={(addressText) => {
                    //   Keyboard.dismiss()
                    //   handleGetPlacesSearchText(addressText)
                    // }}
                    isHaveLeftButton={false}
                    textInputStyle={styles.textInput}
                    listViewStyle={styles.listView}
                    loaddingText={() =>  desInputRef.current?.setAddressText(textDestination)}
                  />
                </View>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0}}>
                  <InputAutoComplete
                    placeholder={langData.choose_an_origin_place[langCode]}
                    onPlaceSelected={(details) => {
                      // Thằng đầy đủ nó có trả về plcae_id
                      // if (!details.place_id) { 
                      //   setTextOrigin(details.description)
                      // }
                      setOriRouteInfo(details)
                      setIsFocusedOriInput(false)
                    }}
                    isFocusedInput={isFocusedOriInput}
                    handleFocus={(condition) => setIsFocusedOriInput(condition)}
                    inputRef={oriInputRef}
                    map_api_key={map_api_key}
                    predefinedPlaces={[...arrPlaceInput, ...arrPlaceInputMainSearch]}
                    // handleGetAddressText={(addressText) => {
                    //   Keyboard.dismiss()
                    //   handleGetPlacesSearchText(addressText)
                    // }}
                    isHaveLeftButton={false}
                    textInputStyle={styles.textInput}
                    listViewStyle={styles.listView}
                    predefinedPlacesDescriptionStyle={styles.predefinedPlacesDescription}
                    loaddingText={() =>  oriInputRef.current?.setAddressText(textOrigin)}
                  />
                </View>
                
              </View>
              <TouchableOpacity 
              onPress={() => {
                const currentOriText = oriInputRef.current.getAddressText() 
                const currentDesText = desInputRef.current.getAddressText() 

                oriInputRef.current.setAddressText(currentDesText)
                desInputRef.current.setAddressText(currentOriText)
                
                if (!oriRouteInfo || !desRouteInfo) {
                  if (currentOriText === 'Địa điểm của tôi') {
                    setOriRouteInfo(desRouteInfo)
                    setDesRouteInfo(arrPlaceInput[0])
                  } else if (currentDesText === 'Địa điểm của tôi') {
                    setDesRouteInfo(oriRouteInfo)
                    setOriRouteInfo(arrPlaceInput[0])
                  } else {
                    const temp = oriRouteInfo
                    setOriRouteInfo(desRouteInfo)
                    setDesRouteInfo(temp)
                  }
                } else {
                  const temp = oriRouteInfo
                  setOriRouteInfo(desRouteInfo)
                  setDesRouteInfo(temp)
                }

              }}
              style={{ padding: 5, paddingLeft: 0}}>
                <Octicons
                  name='arrow-switch' 
                  size={22} 
                  color={app_c.HEX.ext_second}
                  style={{transform: [{ rotate: '90deg'}], marginLeft: 10}}
                />
              </TouchableOpacity>
            </View>
          }
        </View>
        {
          !isShowOptionRoute &&
          <ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            height={40}
            style={styles.tagListTrans}
            // Phương: Only Ios
            contentInset={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 25
            }}
            // Phương: For android
            contentContainerStyle={{
              paddingRight: Platform.OS === 'android' ? 25 : 0
            }}
          >
            {
              typeModeTransport.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.tagContainerTrans, {
                    backgroundColor: tagModeSelected === item.id ? app_c.HEX.fourth : app_c.HEX.primary
                  }]}
                  onPress={() => {
                    // console.log('directionModeGCP', directionModeGCP)

                    if (directionModeGCP !== item.modeGCP) {
                      let start, end, typeDes, typeOri
                      if (directionOriPlaceId) {
                        start = directionOriPlaceId
                        typeOri='place_id'
                      } else {
                        start = origin
                        typeOri='coordinate'
                      }
  
                      if (directionDesPlaceId) {
                        end = directionDesPlaceId
                        typeDes = 'place_id'
                      } else {
                        end = origin
                        typeDes ='coordinate'
                      }
                      let routeModifiers
                      if (item.modeGCP === 'DRIVE' || item.modeGCP === 'TWO_WHEELER') {
                        routeModifiers = {
                          avoidTolls: routesFilter.find(item => item.id === 'avoidTolls').value,
                          avoidHighways: routesFilter.find(item => item.id === 'avoidHighways').value,
                          avoidFerries: routesFilter.find(item => item.id === 'avoidFerries').value
                        }
                      } else if (directionModeGCP === 'WALK') {
                        routeModifiers = {
                          avoidIndoor: routesFilter.find(item => item.id === 'avoidIndoor').value
                        }
                      } else if (item.modeGCP === 'BICYCLE') {
                        routeModifiers = null
                      }
                      handleGetDirections(start, end, typeOri, typeDes, origin, destination, item.modeGCP, item.modeORS, item.id, routeModifiers)
                    }
                  }}
                >
                  <FontAwesome5
                    name={item.icon} 
                    size={18} 
                    color={tagModeSelected === item.id ? app_c.HEX.primary : app_c.HEX.ext_second}
                    style={{paddingLeft: 15}}
                  />
                  <Text style={[styles.tagTextTrans, {
                    color: tagModeSelected === item.id ? app_c.HEX.primary : app_c.HEX.ext_second
                  }]}
                  >
                    {item.title[langCode]}
                  </Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        }
      </>
    }

      {/* Phuong: Button beside */}
      {
        (!isShowWeatherBottomSheet && !isShowScrollCardPlace && !isOpenBottomSheet && !isShowDirectionsBottomSheet && !showDirections) ?
        <View
          style={[styles.besideBtn, {
            bottom: route.params?.isFullScreen ? 30 : 120
          }]}
        >
           {/* Weather */}
           {
            (weather && !isShowWeatherBottomSheet && !isShowScrollCardPlace && !isOpenBottomSheet && !isShowDirectionsBottomSheet && !showDirections) &&
              <TouchableOpacity
              onPress={() => {
                // Call API
                getWeatherForecastAPI(locationCurrent).then((weatherData) => {
                  setWeatherData(weatherData)
                  setIsShowWeatherBottomSheet(true)
                })
              }}
              style={{
                marginRight: 18,
                marginBottom: 15,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image 
                  source={weatherIcons[weather.weather[0].icon]}
                  style={{
                    height: 50,
                    width: 50,
                    marginLeft: 0,
                    ...app_shdw.type_4
                  }}
                />
                <View style={{
                  backgroundColor: app_c.HEX.third,
                  borderRadius: 8,
                  ...app_shdw.type_2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 2,
                  marginTop: -5
                }}>
                  <Text
                    style={{
                      color: app_c.HEX.primary,
                      ...app_typo.fonts.normal.normal.body2,
                      padding: 2
                    }}
                  >{weather.main.temp.toFixed(1)}°C</Text>
                </View>
              </TouchableOpacity>
            }
          
          {
            locationCurrent &&
            <TouchableOpacity
              style={[styles.circleBtn, {
                backgroundColor: app_c.HEX.primary,
              }]}
              onPress={() => moveToMap(locationCurrent, 18, 0)}
            >
              <FontAwesome5 
                name='location-arrow' 
                size={20} 
                color={app_c.HEX.third}
              />
            </TouchableOpacity>
          }

          {
            locationCurrent &&
            <TouchableOpacity
              style={[styles.circleBtn, {
                backgroundColor: app_c.HEX.third,
                marginTop: 10
              }]}
              onPress={() => {
                setShowDirections(true)
                setIsShowOptionRoute(true)
              }}
            >
              <MaterialCommunityIcons 
                name='directions' 
                size={25} 
                color={app_c.HEX.primary}
              />
            </TouchableOpacity>
          }
        </View> : null
      }

      {/* Phuong: Arrow step */}
      {
        (stepPolyLineSelected !== -1) &&
        <View style={{
          position: 'absolute',
          right: 18,
          top: 20,
          height: 45,
         display: 'flex',
         alignItems: 'center',
         flexDirection: 'row',
         ...app_shdw.type_3
        }}>
          {/* Nút backstep */}
          <TouchableOpacity 
          onPress={() => {
            if (stepPolyLineSelected !== 0) {
              if (stepPolyLineSelected !== 1) {
                // Mới đầu di chuyên máy quay đến start và end location
                const edgePadding = {
                  top: 30,
                  right: 70,
                  bottom: 450,
                  left: 70
                }

                // console.log("🚀 ~ file: MapScreen.jsx:1631 ~ Map ~ stepPolyLineSelected:", stepPolyLineSelected)
                const step = directionsPolyLine[selectedPolyLine]?.legs[0]?.steps[stepPolyLineSelected-2]
                handleFitCoors([step?.startLocation?.latLng, step?.endLocation?.latLng], edgePadding, true)
                // Sau đó đặt thanh màu khác để biết đó là thằng step
                setStepPolyLine(step?.polyline)
                // Kéo bottomSheet xuống dưới để nhìn
                directionBottomSheetRef?.current.snapToIndex(1)
                // Đặt để biết thằng nào chọn r
                setStepPolyLineSelected(stepPolyLineSelected-1)
              } else {
                const edgePadding = {
                  top: 30,
                  right: 150,
                  bottom: 450,
                  left: 150
                }
                // Mình sẽ tạo ra thêm 2 thằng nữa để phục vụ animate ngay chỗ mình
                const freeCoor1 = computeDestinationPoint(
                  origin,
                  1000,
                  180
                )

                const freeCoor2 = computeDestinationPoint(
                  origin,
                  1000,
                  0
                )

                // console.log("🚀 ~ file: MapScreen.jsx:1661 ~ Map ~ stepPolyLineSelected:", stepPolyLineSelected)

                handleFitCoors([freeCoor1, origin, freeCoor2], edgePadding, true)
                // Kéo bottomSheet xuống dưới để nhìn
                directionBottomSheetRef?.current.snapToIndex(1)
                // Đặt để biết thằng nào chọn r
                setStepPolyLineSelected(stepPolyLineSelected-1)
                // Nên đặt thằng setStepPolyLine về []
                setStepPolyLine([])
              }
            }
          }} 
          style={{height: 45, width: 45, borderTopLeftRadius: 4, borderBottomLeftRadius: 5, borderWidth: 1, borderColor: app_c.HEX.ext_third, alignItems: 'center', justifyContent: 'center',  backgroundColor: app_c.HEX.primary}}>
            <Ionicons 
              name='md-chevron-back' 
              size={35} 
              color={ directionsPolyLine[selectedPolyLine]?.legs[0]?.steps[stepPolyLineSelected - 1] ? app_c.HEX.ext_second : app_c.HEX.ext_third}
            />
          </TouchableOpacity>

          {/* Nút nextstep */}
          <TouchableOpacity 
          onPress={() => {
            if (stepPolyLineSelected !== directionsPolyLine[selectedPolyLine]?.legs[0]?.steps.length) {
              //  if (stepPolyLineSelected === )
              // Mới đầu di chuyên máy quay đến start và end location
              const edgePadding = {
                top: 30,
                right: 70,
                bottom: 450,
                left: 70
              }
              const index = stepPolyLineSelected
              // console.log("🚀 ~ file: MapScreen.jsx:1692 ~ Map ~ stepPolyLineSelected:", stepPolyLineSelected)
              const step = directionsPolyLine[selectedPolyLine]?.legs[0]?.steps[index]

              handleFitCoors([step?.startLocation?.latLng, step?.endLocation?.latLng], edgePadding, true)
              // Sau đó đặt thanh màu khác để biết đó là thằng step
              setStepPolyLine(step?.polyline)
              // Kéo bottomSheet xuống dưới để nhìn
              directionBottomSheetRef?.current.snapToIndex(1)
              // Đặt để biết thằng nào chọn r
              setStepPolyLineSelected(index+1)
            }
          }}
          style={{height: 45, width: 45, borderTopRightRadius: 4, borderBottomRightRadius: 5, borderWidth: 1, borderColor: app_c.HEX.ext_third, alignItems: 'center', justifyContent: 'center', backgroundColor: app_c.HEX.primary}}>
            <Ionicons 
              name='md-chevron-forward' 
              size={35} 
              color={ directionsPolyLine[selectedPolyLine]?.legs[0]?.steps[stepPolyLineSelected] ? app_c.HEX.ext_second : app_c.HEX.ext_third}
            />
          </TouchableOpacity>
        </View>
      }
      
      {
        isShowScrollCardPlace && 
        <TouchableOpacity
          style={[styles.circleBtn, {
            backgroundColor: app_c.HEX.primary,
            position: 'absolute',
            bottom: route.params?.isFullScreen ? CARD_HEIGHT + 50 : CARD_HEIGHT + 130 + 10,
            right: 0
          }]}
          onPress={() => {
            //  tổng hợp các arrPlace
            let arrPlace = []
            placesTextSearch.map(place => {
              const placeObj = {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }
              arrPlace.push(placeObj)
            })
            
            if (arrPlace.length === 1) {
              // Mình sẽ tạo ra thêm 2 thằng nữa để phục vụ animate ngay chỗ mình
              const freeCoor1 = computeDestinationPoint(
                arrPlace[0],
                10000,
                180
              )

              const freeCoor2 = computeDestinationPoint(
                arrPlace[0],
                10000,
                0
              )

              arrPlace=[
                freeCoor1,
                ...arrPlace,
                freeCoor2
              ]
            }

            const edgePadding = {
              top: 130,
              right: 70,
              bottom: 150,
              left: 70
            }
      
            handleFitCoors(arrPlace, edgePadding, true)
            setArrPlaceToFitCoor(arrPlace)
          }}
        >
          <Foundation 
            name='arrows-in' 
            size={20} 
            color={app_c.HEX.third}
          />
        </TouchableOpacity>
      }

      {/* Phuong: Scroll cards place */}
      {
        isShowScrollCardPlace ? 
        <Animated.ScrollView
          ref={cardScrollViewRef}
          horizontal
          snapToStart={false}
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          style={[styles.cardScrollView, { opacity: (isOpenBottomSheet || showDirections) ? 0 : 1, bottom: route.params?.isFullScreen ? 20 : ((isOpenBottomSheet || showDirections) ? -400 : 110)}]}
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
                  place.photos ? (
                    !StringUtility.hasLink(place?.photos[0]) ? 
                    <ImagePromise
                      isTranformData={true}
                      photoReference={place?.photos[0]}
                      styleImage={styles.cardImage}
                      map_api_key={map_api_key}
                    /> : 
                    <Image
                      source={{uri: place?.photos[0]}}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) :
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
                  <View style={styles.button}>
                    <TouchableOpacity
                      onPress={() => {
                        handleGetPlaceDetails(place.place_id, false)
                      }}
                      style={styles.scrollPlaceBtn}
                    >
                      <Text style={styles.textSign}>Tổng quan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setTextDestination(place?.name)
                        // setPlaceDetails(place)
                        handleRoutePress({
                          latitude: place.geometry.location.lat,
                          longitude: place.geometry.location.lng
                        }, place?.place_id)
                      }}
                      style={styles.scrollPlaceBtn}
                    >
                      <Text style={styles.textSign}>Đường đi</Text>
                    </TouchableOpacity>
                  </View>
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

          {/* <Animated.ScrollView
            ref={cardScrollViewRef}
            horizontal
            pagingEnabled
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 20}
            snapToAlignment="center"
            style={[styles.cardScrollView, {bottom: 120, paddingHorizontal: 0}]}
            contentInset={{
              top: 0,   
              left:SPACING_FOR_CARD_INSET,
              bottom: 0,
              right: SPACING_FOR_CARD_INSET
            }}
            contentContainerStyle={{
              paddingRight: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
            }}
            // onScroll={Animated.event(
            //   [
            //     {
            //       nativeEvent: {
            //         contentOffset: {
            //           x: mapAnimation,
            //         }
            //       },
            //     },
            //   ],
            //   { useNativeDriver: true }
            // )}
          >
            {markers.map((marker) => {
              return (
                <View style={styles.card} key={marker.id}>
                  <Image
                    source={marker.image}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                    <StarRating ratings={marker.rating} reviews={marker.reviews} />
                    <Text
                      numberOfLines={1}
                      style={styles.cardDescription}
                    >
                      {marker.description}
                    </Text>
                    <View style={styles.button}>
                      <TouchableOpacity
                        onPress={() => handleExlorePress(marker.coordinate)}
                        style={[styles.signIn, {
                          borderColor: '#112D4E',
                          borderWidth: 1
                        }]}
                      >
                        <Text style={[styles.textSign, {
                          color: '#112D4E'
                        }]}
                        >
                          Explore Now
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            })}
          </Animated.ScrollView>  */}

      

      {/* weather bottomsheet */}
      {
        (weatherData && isShowWeatherBottomSheet) &&
        <BottomSheetExample
          bottomSheetExampleRef={weatherBottomSheetRef}
          enableContentPanningGesture={Platform.OS === 'android' ? false : true}
          openTermCondition={isShowWeatherBottomSheet}
          closeTermCondition={() => {
            if (placeDetails) {
              setIsOpenBottomSheet(true)
            } else {
              setWeatherData(null)
            }
            setIsShowWeatherBottomSheet(false)
            setWeatherSelected(0)
          }}
          snapPoints={['30%', '60%', '100%']}
          haveBtn={false}
          haveOverlay={false}
          bottomView={{
            paddingHorizontal: 0,
            paddingBottom: 160,
          }}
          childView={
            <View style={{ backgroundColor: app_c.HEX.primary}}>
              <BottomSheetView>
                <Text style={{
                  color: app_c.HEX.fourth,
                  ...app_typo.fonts.normal.lighter.h1,
                  paddingTop: 15,
                  paddingLeft: 18,
                  paddingBottom: 10
                }}>Thời tiết</Text>
                <View style={{
                  width: '100%',
                  paddingHorizontal: 18,
                  alignItems: 'center',
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}>
                    {
                      weatherSelected === 0 &&
                      <View style={{
                        alignItems: 'center',
                      }}>
                          <Text style={{
                            color: app_c.HEX.third,
                            ...app_typo.fonts.normal.lighter.h4
                          }}>{weatherSelected === 0 ? moment(new Date(weatherData.weatherCurrent.sys.sunrise * 1000)).format("kk:mm") : "Không có dữ liệu"}</Text>
                        <Image source={require('../../assets/images/weather/sunrise.png')} style={{
                          height: 45,
                          width: 45,
                        }}/>
                        <Text style={{
                          color: app_c.HEX.ext_second,
                          ...app_typo.fonts.normal.lighter.h5
                        }}>Bình minh</Text>
                      </View>
                    }

                    <View style={{
                      alignItems: 'center',
                      flex: 1
                    }}>
                      <Text style={{ 
                        color: app_c.HEX.ext_second,
                        ...app_typo.fonts.normal.lighter.h3
                      }}>{weatherData.nameGeocoding}</Text>

                      <Image source={weatherSelected === 0 ? weatherIcons[weatherData.weatherCurrent.weather[0].icon] : weatherIcons[weatherData.weatherForecast[weatherSelected-1].weather[0].icon]} style={{
                        height: 120,
                        width: 120,
                        ...app_shdw.type_3,
                        marginVertical: -20
                      }}/>
                      <Text style={{
                        color: app_c.HEX.ext_second,
                        ...app_typo.fonts.normal.bolder.h0
                      }}>{weatherSelected === 0 ? weatherData.weatherCurrent.main.temp.toFixed(1) : weatherData.weatherForecast[weatherSelected-1].main.temp.toFixed(1)}°C</Text>

                      <Text style={{
                        color: app_c.HEX.ext_second,
                        ...app_typo.fonts.normal.lighter.h3,
                        textAlign: 'center',
                        marginVertical: 5
                      }}>{weatherSelected === 0 ? weatherData.weatherCurrent.weather[0].description : weatherData.weatherForecast[weatherSelected-1].weather[0].description}</Text>

                      
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      }}>
                        
                      <Text style={{
                        color: '#018749',
                        ...app_typo.fonts.normal.lighter.h5
                      }}>Thấp: {weatherSelected === 0 ? weatherData.weatherCurrent.main.temp_min.toFixed(1) : weatherData.weatherForecast[weatherSelected-1].main.temp_min.toFixed(1)}°C</Text>
                      
                      <View style={{
                        height: 20,
                        width: 1,
                        backgroundColor: app_c.HEX.ext_second,
                        marginHorizontal: 5,
                        marginBottom: 5
                      }}/>

                      <Text style={{
                        color: '#CC0000',
                        ...app_typo.fonts.normal.lighter.h5
                      }}>Cao: {weatherSelected === 0 ? weatherData.weatherCurrent.main.temp_max.toFixed(1) : weatherData.weatherForecast[weatherSelected-1].main.temp_max.toFixed(1)}°C</Text>
                      </View>

                      <Text style={{
                        color: app_c.HEX.ext_second,
                        ...app_typo.fonts.normal.lighter.h5
                      }}>Cảm thấy như: {weatherSelected === 0 ? weatherData.weatherCurrent.main.feels_like.toFixed(1) : weatherData.weatherForecast[weatherSelected-1].main.feels_like.toFixed(1)}°C</Text> 
                    </View>

                    {
                      weatherSelected === 0 &&
                      <View style={{
                        alignItems: 'center',
                      }}>
                          <Text style={{
                            color: app_c.HEX.third,
                            ...app_typo.fonts.normal.lighter.h4
                          }}>{weatherSelected === 0 ? moment(new Date(weatherData.weatherCurrent.sys.sunset * 1000)).format("kk:mm") : "Không có dữ liệu"}</Text>
                        <Image source={require('../../assets/images/weather/sunset.png')} style={{
                          height: 50,
                          width: 50,
                        }}/>
                        <Text style={{
                          color: app_c.HEX.ext_second,
                          ...app_typo.fonts.normal.lighter.h5
                        }}>Hoàng hôn</Text>
                      </View>
                    }
                  </View>
                </View>

                <View style={{
                  marginHorizontal: 18,
                  backgroundColor: app_c.HEX.ext_primary,
                  borderRadius: 8,
                  height: 110,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                  flexDirection: 'row',
                  ...app_shdw.type_2
                }}>
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: (app_dms.screenWidth - 36) / 4
                  }}>
                    <Text
                      style={{
                        color: app_c.HEX.third,
                      ...app_typo.fonts.normal.lighter.h4
                      }}
                    >{weatherSelected === 0 ? weatherData.weatherCurrent.wind.speed.toFixed(1) : weatherData.weatherForecast[weatherSelected-1].wind.speed.toFixed(1)}km/h</Text>
                    <MaterialCommunityIcons 
                      name='weather-windy' 
                      size={25} 
                      color={app_c.HEX.ext_second}
                      style={{
                        marginVertical: 8
                      }}
                    />
                    <Text style={{
                      color: app_c.HEX.ext_second,
                      ...app_typo.fonts.normal.lighter.h5
                    }}>Tốc độ gió</Text>
                  </View>
                  <View style={{
                    height: '100%',
                    width: 1.5,
                    backgroundColor: app_c.HEX.primary
                  }}/>

                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: (app_dms.screenWidth - 36) / 4
                  }}>
                    <Text
                      style={{
                        color: app_c.HEX.third,
                      ...app_typo.fonts.normal.lighter.h4
                      }}
                    >{weatherSelected === 0 ? weatherData.weatherCurrent.main.humidity : weatherData.weatherForecast[weatherSelected-1].main.humidity}%</Text>
                    <Entypo 
                      name='water' 
                      size={25} 
                      color={app_c.HEX.ext_second}
                      style={{
                        marginVertical: 8
                      }}
                    />
                    <Text style={{
                      color: app_c.HEX.ext_second,
                      ...app_typo.fonts.normal.lighter.h5
                    }}>Độ ẩm</Text>
                  </View>
                  <View style={{
                    height: '100%',
                    width: 1.5,
                    backgroundColor: app_c.HEX.primary
                  }}/>

                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: (app_dms.screenWidth - 36) / 4
                  }}>
                    <Text
                      style={{
                        color: app_c.HEX.third,
                      ...app_typo.fonts.normal.lighter.h4
                      }}
                    >{weatherSelected === 0 ? weatherData.weatherCurrent.clouds.all : weatherData.weatherForecast[weatherSelected-1].clouds.all}%</Text>
                    <Entypo 
                      name='cloud' 
                      size={25} 
                      color={app_c.HEX.ext_second}
                      style={{
                        marginVertical: 8
                      }}
                    />
                    <Text style={{
                      color: app_c.HEX.ext_second,
                      ...app_typo.fonts.normal.lighter.h5
                    }}>Mây</Text>
                  </View>
                  <View style={{
                    height: '100%',
                    width: 1.5,
                    backgroundColor: app_c.HEX.primary
                  }}/>

                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: (app_dms.screenWidth - 36) / 4
                  }}>
                    <Text
                      style={{
                        color: app_c.HEX.third,
                      ...app_typo.fonts.normal.lighter.h4
                      }}
                    >{weatherSelected === 0 ? (weatherData.weatherCurrent.visibility/1000).toFixed(1) : (weatherData.weatherForecast[weatherSelected-1].visibility/1000).toFixed(1)}km</Text>
                    <MaterialCommunityIcons 
                      name='weather-fog' 
                      size={30} 
                      color={app_c.HEX.ext_second}
                      style={{
                        marginVertical: 7
                      }}
                    />
                    <Text style={{
                      color: app_c.HEX.ext_second,
                      ...app_typo.fonts.normal.lighter.h5
                    }}>Tầm nhìn</Text>
                  </View>
                </View>

                <Text style={{
                  marginLeft: 18,
                  marginTop: 20,
                  color: app_c.HEX.ext_second,
                  ...app_typo.fonts.normal.lighter.h4
                }}>Dự báo 5 ngày / 3h</Text>

                <FlatList
                  horizontal
                  nestedScrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  data={weatherData.weatherForecast}
                  keyExtractor={(item, index) => `weather-${index}`}
                  contentContainerStyle={{ paddingHorizontal: 18 }}
                  style={{
                    marginTop: 18,
                    width: '100%'
                  }}
                  renderItem={({item, index}) => {
                    // console.log('index', index)
                    let dateTimeData
                    // if (index === 0) {
                    //   dateTimeData = weatherData.weatherCurrent
                    // } else {
                      dateTimeData = item
                    // }
                    const date = moment(new Date(dateTimeData.dt * 1000)).format("DD/MM/YYYY")
                    const time = moment(new Date(dateTimeData.dt * 1000)).format("kk:mm")
                    return (
                      <>
                        { index === 0 &&
                          <TouchableOpacity
                            onPress={() => {
                              setWeatherSelected(0)
                            }}
                            style={{
                              height: 150,
                              width: 90,
                              borderRadius: 45,
                              backgroundColor: weatherSelected === 0 ? app_c.HEX.third : app_c.HEX.ext_primary,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginLeft: 0,
                              ...app_shdw.type_2,
                              marginBottom: 20
                            }}
                            >
                            <Text style={{
                              color: weatherSelected === 0 ? app_c.HEX.primary : app_c.HEX.ext_second,
                              ...app_typo.fonts.normal.lighter.h5
                            }}>{moment(new Date(weatherData.weatherCurrent.dt * 1000)).format("DD/MM/YYYY")}</Text>
                            <Text style={{
                              color: weatherSelected === 0 ? app_c.HEX.primary : app_c.HEX.ext_second,
                              ...app_typo.fonts.normal.lighter.h5
                            }}>{moment(new Date(weatherData.weatherCurrent.dt * 1000)).format("kk:mm")}</Text>
                            <Image source={weatherIcons[weatherData.weatherCurrent.weather[0].icon]} style={{
                              height: 50,
                              width: 50,
                              ...app_shdw.type_2,
                              marginVertical: -5
                            }}/>
                            <Text style={{
                              color: weatherSelected === 0 ? app_c.HEX.primary : app_c.HEX.ext_second,
                              ...app_typo.fonts.normal.lighter.h3
                            }}>{weatherData.weatherCurrent.main.temp.toFixed(1)}°C</Text>
                          </TouchableOpacity>
                        }
      
                        <TouchableOpacity
                          onPress={() => {
                            setWeatherSelected(index+1)
                          }}
                          style={{
                            height: 150,
                            width: 90,
                            borderRadius: 45,
                            backgroundColor: weatherSelected === index+1 ? app_c.HEX.third : app_c.HEX.ext_primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 20,
                            ...app_shdw.type_2,
                            marginBottom: 20
                          }}
                          >
                          <Text style={{
                            color: weatherSelected === index+1 ? app_c.HEX.primary : app_c.HEX.ext_second,
                            ...app_typo.fonts.normal.lighter.h5
                          }}>{date}</Text>
                          <Text style={{
                            color: weatherSelected === index+1 ? app_c.HEX.primary : app_c.HEX.ext_second,
                            ...app_typo.fonts.normal.lighter.h5
                          }}>{time}</Text>
                          <Image source={weatherIcons[dateTimeData.weather[0].icon]} style={{
                            height: 50,
                            width: 50,
                            ...app_shdw.type_2,
                            marginVertical: -5
                          }}/>
                          <Text style={{
                            color: weatherSelected === index+1 ? app_c.HEX.primary : app_c.HEX.ext_second,
                            ...app_typo.fonts.normal.lighter.h3
                          }}>{dateTimeData.main.temp.toFixed(1)}°C</Text>
                        </TouchableOpacity>
                      </>
                    )
                  }
                  }
                />
              </BottomSheetView>
            </View>
          }
        />
      }

      {/* filter for route */}
      {
        isShowFilterDirectionBottomSheet &&
        <BottomSheetExample
          bottomSheetExampleRef={filterDirectionBottomSheetRef}
          openTermCondition={isShowFilterDirectionBottomSheet}
          closeTermCondition={() => {
            setIsShowFilterDirectionBottomSheet(false)
            setRoutesFilter(currentFilter.routes)
          }}
          snapPoints={['20%', '55%']}
          haveBtn={false}
          haveOverlay={true}
          bottomView={{
            paddingHorizontal: 0,
            paddingBottom: 120,
          }}
          childView={
            <View style={{ backgroundColor: app_c.HEX.primary, flex: 1}}>
              <BottomSheetView>
                <View style={styles.headerTextFilterContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(resetRoutes())
                    }}
                    style={styles.leftHeaderBtnFilter}
                  >
                    <Text style={styles.rightHeaderBtnTextFilter}>Đặt lại</Text>
                  </TouchableOpacity>
                  <Text style={styles.headerTextFilter}>Cài đặt</Text>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(updateRoutes(routesFilter))
                      setIsShowFilterDirectionBottomSheet(false)
                    }}
                    style={styles.rightHeaderBtnFilter}
                  >
                    <Text style={styles.rightHeaderBtnTextFilter}>Lưu</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10, paddingHorizontal: 18}}>
                  {
                    routesFilter.map((route, index) => {
                      if (index !== routesFilter.length -1)
                      return (
                        <View 
                          key={`route-filter${route.id}`}
                        >
                          {
                            index === 0 &&
                            <Text style={styles.titleBottomSheet}>Dành cho xe máy và xe hơi</Text>
                          }
                          <CheckBoxText 
                            label={route.label.vi}
                            onPress={() => {
                              const restOfRoutes = routesFilter.filter((item => item.id !== route.id))
                              const routeToUpdate = cloneDeep(route)

                              routeToUpdate.value = !route.value
                              restOfRoutes.splice(index, 0, routeToUpdate)
                              
                              setRoutesFilter(restOfRoutes)
                          }}
                            isChecked={route.value}
                          />
                        </View>
                      )
                      else 
                      return (
                        <View 
                          key={`route-filter${route.id}`}
                        >
                          <View style={styles.saperate}/>
                          <Text style={[styles.titleBottomSheet,{ marginTop: 10}]}>Dành cho người đi bộ</Text>
                            <CheckBoxText
                              label={route.label.vi}
                              onPress={() => {
                                const restOfRoutes = routesFilter.filter((item => item.id !== route.id))
                                const routeToUpdate = cloneDeep(route)

                                routeToUpdate.value = !route.value
                                restOfRoutes.splice(index,0,routeToUpdate)

                                setRoutesFilter(restOfRoutes)
                            }}
                              isChecked={route.value}
                            />
                        </View>
                      )
                    })
                  }

                </View>

              </BottomSheetView>
            </View>
          }
        />
      }

      {/* Bottomsheet for map type */}
      {
        isShowMapTypeBottomSheet &&
        <BottomSheetExample
          bottomSheetExampleRef={mapTypeBottomSheetRef}
          enableContentPanningGesture={Platform.OS === 'android' ? false : true}
          openTermCondition={isShowMapTypeBottomSheet}
          closeTermCondition={() => {
            setIsShowMapTypeBottomSheet(false)
          }}
          snapPoints={['40%', '80%']}
          haveBtn={false}
          haveOverlay={true}
          bottomView={{
            paddingHorizontal: 0,
            paddingBottom: 120,
          }}
          childView={
            <View style={{ backgroundColor: app_c.HEX.primary, flex: 1}}>
              <BottomSheetView>
                <Text style={[styles.headerTextFilter, { marginLeft: 18 }]}>{langData.setting_map[langCode]}</Text>
                <View style={{ marginTop: 15}}>
                  <Text style={[styles.titleBottomSheet, {color: app_c.HEX.ext_second, paddingHorizontal: 18}]}>Loại bản đồ</Text>
                  <View 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5
                  }}>
                    <FlatList 
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={mapTypes}
                      keyExtractor={item => `map-${item.id}`}
                      contentContainerStyle={{ paddingHorizontal: 18 }}
                      style={{
                        width: '100%',
                        marginBottom: 10
                      }}
                      renderItem={({item, index}) => {
                        // console.log("🚀 ~ file: MapScreen.jsx:2711 ~ currentMap.mapTypes:", currentMap.mapTypes)
                        if (index !== mapTypes.length -1)
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(updateMapTypes(item.id))
                            }}
                            style={{
                              marginLeft: index === 0 ? 0 : 15,
                              marginRight: index === mapTypes.length - 1 ? 45 : 0,
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            <Image source={item.image} 
                            resizeMode= 'center'
                            style={{
                              height: 120,
                              width: 120,
                              borderRadius: 18,
                              borderWidth: currentMap.mapTypes === item.id ? 2 : 0,
                              borderColor: currentMap.mapTypes === item.id ? app_c.HEX.third : 'transparent',
                              ...app_shdw.type_2
                            }}/>
                            <Text style={{
                              color: currentMap.mapTypes === item.id ? app_c.HEX.third : app_c.HEX.ext_second,
                              ...app_typo.fonts.normal.bolder.h5,
                              marginTop: 10
                            }}>{item.vi}</Text>
                          </TouchableOpacity>
                        )
                      }}
                    />
                  </View>
                </View>
                <View style={styles.saperate}/>
                <Text style={[styles.titleBottomSheet, {color: app_c.HEX.ext_second, paddingHorizontal: 18, marginTop: 15}]}>Chi tiết bản đồ</Text>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(updateMapDetails(!currentMap.mapDetails))
                  }}
                  style={{
                    marginLeft: 18,
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                    marginTop: 10,
                  }}
                >
                  <Image source={mapTypes[mapTypes.length -1].image} 
                  resizeMode= 'center'
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 18,
                    borderWidth: currentMap.mapDetails ? 2 : 0,
                    borderColor: currentMap.mapDetails ? app_c.HEX.third : 'transparent',
                    ...app_shdw.type_2
                  }}/>
                  <Text style={{
                    color: currentMap.mapDetails ? app_c.HEX.third : app_c.HEX.ext_second,
                    ...app_typo.fonts.normal.bolder.h5,
                    marginTop: 10
                  }}>{mapTypes[mapTypes.length -1].vi}</Text>
                </TouchableOpacity>


              </BottomSheetView>
            </View>
          }
        />
      }

      {/* bottom sheet for details */}
      <BottomSheetScroll
        openTermCondition={isOpenBottomSheet}
        closeTermCondition={() => {
          // TH1: Khi user click vào 1 địa điểm ngay từ đầu
          if (!placesTextSearch && placeDetails) {
            setIsShowBackIcon(false)
            setPlaceDetails(null)
            setDestination(null)
            setPlacesTextSearch(null)
            inputRef.current?.clear()
          }
          // TH2: Khi người dùng search nheièu địa điểm và tìm trên bản đồ 1 địa điểm khác
          else if (placesTextSearch && placeDetails) {
            setPlaceDetails(null)
            setDestination(null)
            inputRef.current?.setAddressText(previousTextSearch)
            setIsShowScrollCardPlace(true)
            // const edgePadding = {
            //   top: 70,
            //   right: 70,
            //   bottom: 260,
            //   left: 70
            // }
            // handleFitCoors(arrPlaceToFitCoor, edgePadding, true)
          }
          
          setIsOpenBottomSheet(false)
        }}
        snapPoints={['30%', '100%']}
        haveBtn={false}
        haveOverlay={false}
        bottomView={{
          paddingHorizontal: 0,
          paddingBottom: 120,
        }}
        haveHeader={true}
        childHeader={
          <Text style={styles.headerBottomSheet}>{placeDetails?.name}</Text>
        }
        childView={
          <View>
            <View style={styles.contentContainer}>
              <View style={styles.typeTimeContainer}>
                {
                  placeDetails?.types.length > 0 &&
                  placeDetails?.types.map((type, index) => {
                    const typePlace = typesPlace.find(typePlace => typePlace.id === type)
                    if (typePlace)
                      return (
                        <View key={index} style={styles.textTypeContainer}>
                          <Text style={styles.textType}>{typePlace[typePlace.id].vi}</Text>
                        </View>
                      )
                  })
                }

                {/* Phuong: Này để làm sau hoặc có thể không làm */}
                {/* <View style={styles.timeContainer}>
                  <FontAwesome5 
                    name='walking' 
                    size={20} 
                    color={app_c.HEX.ext_second}
                  />
                  <Text style={styles.textTimeDirection}>6 phút</Text>
                </View> */}
              </View>

              {
                (placeDetails?.rating && placeDetails?.user_ratings_total) &&
                <StarRating 
                  ratings={placeDetails?.rating} 
                  reviews={placeDetails?.user_ratings_total} 
                  containerStyle={styles.starRating}
                  textRatingStyle={{color: app_c.HEX.ext_second, ...app_typo.fonts.normal.normal.body1}}
                  textReviewStyle={{color: app_c.HEX.ext_second, ...app_typo.fonts.normal.normal.body1}}
                />
              }

              {
                placeDetails?.current_opening_hours &&
                <View style={styles.dropDownContainer}>
                  <Pressable style={styles.statusTimeContainer} onPress={() => handleToggleOpenHoursAnimation()}>
                    <Text style={[styles.textStatus, {
                      color: '#C93F37'
                    }]}>{placeDetails?.current_opening_hours.open_now ? 'Đang mở cửa' : 'Đang đóng cửa'}</Text>
                    <Entypo 
                      name='dot-single' 
                      size={20} 
                      color={app_c.HEX.ext_second}
                    />
                    <Text style={styles.textTimeOpen}>Lịch mở cửa</Text>
                    <Animated.View style={{transform: [{rotateZ: arrowTranform}]}}>
                      <MaterialIcons 
                        name='keyboard-arrow-down' 
                        size={20} 
                        color={app_c.HEX.ext_second}
                      />
                    </Animated.View>
                  </Pressable>
                  {
                    isToggleOpenHours &&
                    <View style={styles.openHoursContainer}>
                      {
                        placeDetails?.current_opening_hours.weekday_text.map((weekdayText, index) => {
                          const arrWeekdayText = weekdayText.split(': ')
                          return (
                            <View key={index} style={styles.weekdayTextContainer}>
                              <View style={styles.weekdayTextCell}>
                                <Text style={styles.weekdayText}>{arrWeekdayText[0]}</Text>
                              </View>
                              <View style={styles.weekdayTextCell}>
                                <Text style={styles.weekdayText}>{arrWeekdayText[1]}</Text>
                              </View>
                              <View style={styles.spaceForWeekdayText}/>
                            </View>
                          )
                        })
                      }
                    </View>
                  }
                </View>
              }
            </View>
            
            {
              placeDetails?.formatted_address &&
              <Text style={[styles.formattedAddress, { marginTop: 5}]}>Địa chỉ: {placeDetails?.formatted_address}</Text>
            }


            {
              placeDetails?.formatted_phone_number &&
              <Text style={styles.formattedAddress}>Số điện thoại: {placeDetails?.formatted_phone_number}</Text>
            }

            {
              placeDetails?.website &&
              <Text style={styles.formattedAddress}>Website: {placeDetails?.website}</Text>
            }

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -5,
              marginBottom: 10
            }}>
              <TouchableOpacity onPress={() => {
                setIsOpenBottomSheet(false)
                // Call API
                getWeatherForecastAPI({
                  longitude: placeDetails.geometry.location.lng,
                  latitude: placeDetails.geometry.location.lat
                }).then((weatherData) => {
                  setWeatherData(weatherData)
                  setIsShowWeatherBottomSheet(true)
                })
              }}>
                <Text style={[styles.weatherText, { marginTop: 5}]}>Thời tiết tại đây</Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/weather/weather.png')} style={{
                height: 30,
                width: 30,
                marginLeft: 10,
                marginBottom: 5
              }}/>
            </View>
            
            <ScrollView
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              height={40}
              style={styles.controlListContainer}
              // Phương: Only Ios
              contentInset={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 25
              }}
              // Phương: For android
              contentContainerStyle={{
                paddingRight: Platform.OS === 'android' ? 25 : 0
              }}
            >
              <TouchableOpacity
                style={styles.controlContainer}
                onPress={() => {
                  navigation.push('PlaceDetailScreen', {
                    placeId: placeDetails.place_id,
                    typeOfBriefPlace: 'all'
                  });
                }}
              >
                <FontAwesome5 
                  name='book-open' 
                  size={20} 
                  color={app_c.HEX.third}
                />
                <Text style={[styles.controlText, {
                  color: app_c.HEX.third
                }]}
                >Xem chi tiết</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlContainer}
                onPress={() => {
                  setTextDestination(placeDetails?.name)
                  handleRoutePress({
                    latitude: placeDetails.geometry.location.lat,
                    longitude: placeDetails.geometry.location.lng
                  }, placeDetails?.place_id)
                }}
              >
                <FontAwesome5 
                  name='directions' 
                  size={20} 
                  color={app_c.HEX.third}
                />
                <Text style={[styles.controlText, {
                  color: app_c.HEX.third
                }]}
                >Đường đi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlContainer}
                onPress={() => {
                  
                }}
              >
                <FontAwesome5 
                  name='location-arrow' 
                  size={20} 
                  color={app_c.HEX.third}
                />
                <Text style={[styles.controlText, {
                  color: app_c.HEX.third
                }]}
                >Bắt đầu</Text>
              </TouchableOpacity>

              {
                placeDetails?.website &&
                <TouchableOpacity
                  style={styles.controlContainer}
                  onPress={() => Linking.openURL(placeDetails?.website)}
                >
                  <FontAwesome5 
                    name='globe-americas' 
                    size={20} 
                    color={app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color: app_c.HEX.third
                  }]}
                  >Trang web</Text>
                </TouchableOpacity>
              }

              {
                placeDetails?.formatted_phone_number &&
                <TouchableOpacity
                  style={styles.controlContainer}
                  onPress={() => Linking.openURL(`tel:${placeDetails?.formatted_phone_number}`)}
                >
                  <FontAwesome5 
                    name='phone-alt' 
                    size={20} 
                    color={app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color: app_c.HEX.third
                  }]}
                  >Gọi</Text>
                </TouchableOpacity>
              }

              {
                placeDetails &&
                <TouchableOpacity
                  style={[styles.controlContainer, {
                    backgroundColor: currentMap.places.find(place => place.place_id === placeDetails.place_id) ? app_c.HEX.third : app_c.HEX.primary
                  }]}
                  onPress={async () => {
                    const exsitPlace = currentMap.places.find(place => place.place_id === placeDetails.place_id)
                    // console.log("🚀 ~ file: MapScreen.jsx:2951 ~ onPress={ ~ exsitPlace:", exsitPlace)
                    if (exsitPlace) {
                      const placeToUpdate = currentMap.places.filter(place => place.place_id !== placeDetails.place_id)
                      dispatch(updatePlaces(placeToUpdate))
                      await updateMapUserAPI({
                        currentUserId: user ? user._id : temporaryUserId,
                        savedPlaces: placeToUpdate
                      }).catch((err) => dispatch(updatePlaces(exsitPlace)))
                    } else {
                      const dataToUpdate = [
                        {
                          place_id: placeDetails.place_id,
                          icon: placeDetails.icon,
                          coordinate: {
                            longitude: placeDetails.geometry.location.lng,
                            latitude: placeDetails.geometry.location.lat
                          },
                          icon_background_color: placeDetails.icon_background_color
                        },
                        ...currentMap.places
                      ]
                      // console.log("🚀 ~ file: MapScreen.jsx:2977 ~ onPress={ ~ dataToUpdate:", dataToUpdate)
                      dispatch(updatePlaces(dataToUpdate))
                      await updateMapUserAPI({
                        currentUserId: user ? user._id : temporaryUserId,
                        savedPlaces: dataToUpdate
                      }).catch((err) => dispatch(updatePlaces(exsitPlace)))
                    }
                  }}
                >
                  <FontAwesome5 
                    name='map-marker-alt' 
                    size={20} 
                    color={currentMap.places.find(place => place.place_id === placeDetails.place_id) ? app_c.HEX.primary : app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color:currentMap.places.find(place => place.place_id === placeDetails.place_id) ? app_c.HEX.primary : app_c.HEX.third
                  }]}
                  >{currentMap.places.find(place => place.place_id === placeDetails.place_id) ? 'Đã lưu tọa độ' : 'Lưu tọa độ'}</Text>
                </TouchableOpacity>
              }

              {
                placeDetails &&
                <TouchableOpacity
                  style={[styles.controlContainer, {
                    backgroundColor: currentMap.suggestions.find(place => place.place_id === placeDetails.place_id) ? app_c.HEX.third : app_c.HEX.primary
                  }]}
                  onPress={async () => {
                    const exsitPlace = currentMap.suggestions.find(place => place.place_id === placeDetails.place_id)
                    if (exsitPlace) {
                      const placeToUpdate = currentMap.suggestions.filter(place => place.place_id !== placeDetails.place_id)
                      // console.log("🚀 ~ file: MapScreen.jsx:2980 ~ Map ~ placeToUpdate:", placeToUpdate)
                      dispatch(updateSuggestions(placeToUpdate))
                      await updateMapUserAPI({
                        currentUserId: user ? user._id : temporaryUserId,
                        savedSuggestions: placeToUpdate
                      }).catch((err) => dispatch(updateSuggestions(exsitPlace)))
                    } else {
                      const placeToUpdate = [
                        {
                          place_id: placeDetails.place_id,
                          description: placeDetails.name,
                          geometry: placeDetails.geometry
                        },
                        ...currentMap.suggestions
                      ]
                      dispatch(updateSuggestions(placeToUpdate))
                      await updateMapUserAPI({
                        currentUserId: user ? user._id : temporaryUserId,
                        savedSuggestions: placeToUpdate
                      }).catch((err) => dispatch(updateSuggestions(exsitPlace)))
                    }
                  }}
                >
                  <FontAwesome5 
                    name='list' 
                    size={20} 
                    color={currentMap.suggestions.find(place => place.place_id === placeDetails.place_id) ? app_c.HEX.primary : app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color:currentMap.suggestions.find(place => place.place_id === placeDetails.place_id) ? app_c.HEX.primary : app_c.HEX.third
                  }]}
                  >{currentMap.suggestions.find(place => place.place_id === placeDetails.place_id) ? 'Đã lưu gợi ý' : 'Lưu gợi ý'}</Text>
                </TouchableOpacity>
              }

              <TouchableOpacity
                style={styles.controlContainer}
                onPress={() => handleShareButton(placeDetails?.photos[0])}
              >
                <FontAwesome5 
                  name='share' 
                  size={20} 
                  color={app_c.HEX.third}
                />
                <Text style={[styles.controlText, {
                  color: app_c.HEX.third
                }]}
                >Chia sẻ</Text>
              </TouchableOpacity>
            </ScrollView>

            {
              placeDetails?.photos ?
              <ScrollView
                horizontal
                nestedScrollEnabled={false}
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                height={320}
                style={styles.imgListContainer}
                // Phương: Only Ios
                contentInset={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 35
                }}
                // Phương: For android
                contentContainerStyle={{
                  paddingRight: Platform.OS === 'android' ? 25 : 0
                }}
              >
                {
                  placeDetails?.photos.map((photo, index) => {
                    const length = placeDetails?.photos.length
                    const stopLoopIndex = length % 3 === 0 ?  (length / 3) : (length /3) + 1
                    if (index < stopLoopIndex ) {
                      let endIndexImg = ((index + 1) * 3) - 1
                      if (placeDetails?.photos) {
                        if (placeDetails?.photos[endIndexImg-2])
                        return (
                          <View 
                            key={index}
                            style={styles.containerImg}
                          >
                            <>
                                  <Image 
                                    style={[styles.imgBigger, { position: 'absolute', backgroundColor: app_c.HEX.ext_third, bottom: 0}]}
                                    source={{uri: placeDetails?.photos[endIndexImg-2]}}
                                  /> 
                                  <ImageModal
                                      swipeToDismiss={true}
                                      resizeMode={isResizeMode}
                                      modalImageResizeMode="contain"
                                      imageBackgroundColor="transparent"
                                      style={[styles.imgBigger, {  opacity: 0 }]}
                                      source={{uri: placeDetails?.photos[endIndexImg-2]}}
                                      onOpen={() => {
                                        setIsResizeMode("contain")
                                        // console.log("contain")
                                      }}
                                      willClose={() => {
                                        setIsResizeMode("cover")
                                        // console.log("cover")
                                      }}
                                    />
                                    {/* <Lightbox 
                                      navigator={navigator}
                                      underlayColor="#fff"
                                      activeProps={{width: app_dms.screenWidth, height: 400}}
                                      useNativeDriver={false}
                                    >
                                      <Image
                                        style={styles.imgBigger}
                                        source={{uri: placeDetails?.photos[endIndexImg-2]}}
                                      />
                                    </Lightbox> */}
                                </> 
                            {
                              placeDetails?.photos[endIndexImg-1] ?
                              <View style={[styles.containerImgSmaller, {
                                marginRight: 10
                              }]}> 
                                {
                                  placeDetails?.photos[endIndexImg-1] ?
                                  <>
                                    <Image 
                                      style={[styles.imgSmaller, { marginBottom: 5, position: 'absolute', backgroundColor: app_c.HEX.ext_third, top: 0}]}
                                      source={{uri: placeDetails?.photos[endIndexImg-1]}}
                                    /> 
                                    <ImageModal
                                        swipeToDismiss={true}
                                        resizeMode={isResizeMode}
                                        modalImageResizeMode="contain"
                                        imageBackgroundColor="transparent"
                                        style={[styles.imgSmaller, { marginBottom: 5, opacity: 0 }]}
                                        source={{uri: placeDetails?.photos[endIndexImg-1]}}
                                        onOpen={() => {
                                          setIsResizeMode("contain")
                                          // console.log("contain")
                                        }}
                                        willClose={() => {
                                          setIsResizeMode("cover")
                                          // console.log("cover")
                                        }}
                                      />
                                    {/* <Lightbox 
                                      navigator={navigator}
                                      underlayColor="#fff"
                                      activeProps={{width: '100%', height: 400}}
                                      useNativeDriver={false}
                                    >
                                      <Image
                                        style={[styles.imgSmaller, { marginBottom: 5}]}
                                        source={{uri: placeDetails?.photos[endIndexImg-1]}}
                                      />
                                    </Lightbox> */}
                                  </>
                                   :
                                  <View style={styles.imgEmply}/>
                                }
                                {
                                  placeDetails?.photos[endIndexImg] ?
                                  <>
                                  <Image 
                                    style={[styles.imgSmaller, { marginTop: 5, position: 'absolute', backgroundColor: app_c.HEX.ext_third, bottom: 0}]}
                                    source={{uri: placeDetails?.photos[endIndexImg]}}
                                  /> 
                                  <ImageModal
                                      swipeToDismiss={true}
                                      resizeMode={isResizeMode}
                                      modalImageResizeMode="contain"
                                      imageBackgroundColor="transparent"
                                      style={[styles.imgSmaller, { marginTop: 5, opacity: 0 }]}
                                      source={{uri: placeDetails?.photos[endIndexImg]}}
                                      onOpen={() => {
                                        setIsResizeMode("contain")
                                        // console.log("contain")
                                      }}
                                      willClose={() => {
                                        setIsResizeMode("cover")
                                        // console.log("cover")
                                      }}
                                    />
                                    {/* <Lightbox 
                                      navigator={navigator}
                                      underlayColor="#fff"
                                      activeProps={{width: '100%', height: 400}}
                                      useNativeDriver={false}
                                    >
                                      <Image
                                        style={[styles.imgSmaller, { marginTop: 5}]}
                                        source={{uri: placeDetails?.photos[endIndexImg]}}
                                      />
                                    </Lightbox> */}
                                </> 
                                :
                                  <View style={styles.imgEmplyGray}/>
                                }
                              </View> : null
                            }
                          </View>
                        )
                      } else {
                        if (placeDetails?.photos[endIndexImg-2])
                        return (
                          <View 
                            key={index}
                            style={styles.containerImg}
                          >
                            {
                              placeDetails?.photos[endIndexImg-1] &&
                              <View style={[styles.containerImgSmaller, {
                                marginRight: 10
                              }]}> 
                                {
                                  placeDetails?.photos[endIndexImg-1] ?
                                  <ImagePromise
                                    isTranformData={true}
                                    photoReference={placeDetails?.photos[endIndexImg-1]}
                                    styleImage={[styles.imgSmaller, {
                                      marginBottom: 5
                                    }]}
                                    map_api_key={map_api_key}
                                    // pushArrImgBase64={(data) => setArrImgBase64([...arrImgBase64, data])}
                                  /> :
                                  <View style={styles.imgEmply}/>
                                }
                                {
                                  placeDetails?.photos[endIndexImg] ?
                                  <ImagePromise
                                    isTranformData={true}
                                    photoReference={placeDetails?.photos[endIndexImg]}
                                    styleImage={[styles.imgSmaller, {
                                      marginTop: 5
                                    }]}
                                    map_api_key={map_api_key}
                                    // pushArrImgBase64={(data) => setArrImgBase64([...arrImgBase64, data])}
                                  /> :
                                  <View style={styles.imgEmplyGray}/>
                                }
                              </View>
                            }
                          </View>
                        )
                      }
                    }
                  })
                }
              </ScrollView>
              : 
              null
            }

            {
              placeDetails?.reviews ?
              <Text style={styles.headerReview}>Đánh giá và xếp hạng</Text> : null
            }

            {
              (placeDetails?.reviews) ?
              <View style={app_sp.ph_18}>
               {
                placeDetails?.reviews.map((review, index) => {
                  return (
                    <ReviewSectionPromise
                      review={review}
                      key={index}
                      isTranformData={placeDetails?.isTranformData ? true : false}
                    />
                  )
                })
              }
              </View>
              : null
            }
          </View>
        }
      />

      <BottomSheetExample
        bottomSheetExampleRef={bottomSheetExampleRef}
        openTermCondition={isOpenBottomSheetFilter}
        closeTermCondition={() => {
          setIsOpenBottomSheetFilter(false)
        }}
        snapPoints={['20%', '40%', '90%']}
        labelBtn='Save'
        handleLabelBtn={() => null}
        haveBtn={true}
        haveOverlay={true}
        haveHeader={true}
        childView={
          <NavigationContainer independent={true}>
            <Stack.Navigator 
              initialRouteName='FilterScreen'
            >
              <Stack.Screen
                name='FilterScreen'
                options={{ header: () => null }}
              >
                {() => 
                <Filter
                  closeTermCondition={() => {
                    setIsOpenBottomSheetFilter(false)
                  }}
                  bottomSheetExampleRef={bottomSheetExampleRef}
                  locationCurrent={locationCurrent}
                  map_api_key={map_api_key}
                  arrPlaceInput={arrPlaceInput}
                />}
              </Stack.Screen>

              <Stack.Screen
                name='CategoriesScreen'
                options={{ header: () => null }}
              >
                {() => 
                <Category
                  typesPlace={typesPlace}
                />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        }
      />

      <BottomSheetExample
        bottomSheetExampleRef={directionBottomSheetRef}
        openTermCondition={isShowDirectionsBottomSheet}
        closeTermCondition={() => {
          setIsShowRoutePanel(true)
          setIsShowDirectionsBottomSheet(false)
          const edgePadding = {
            top: 330,
            right: 40,
            bottom: 150,
            left: 40
          }
          handleFitCoors(directionsPolyLine[selectedPolyLine]?.polyline, edgePadding, true)
          // Đặt lại stepPolyLineSelected
          setStepPolyLineSelected(-1)
          // Đặt lại stepPolyLine
          setStepPolyLine([])
        }}
        snapPoints={['20%', '50%', '90%']}
        haveBtn={false}
        haveOverlay={false}
        bottomView={{
          paddingHorizontal: 0,
          paddingBottom: 120,
        }}
        childView={
          <View style={{ backgroundColor: app_c.HEX.primary, flex: 1}}>
            <BottomSheetView>
              <View style={styles.headerBottomSheetDirection}>
                <Text style={styles.titleBottomSheetDirection}>{directionsPolyLine[selectedPolyLine]?.description}</Text>
                <Text style={styles.timeBottomSheetDirection}>{days !== 0 ? `${days} day${days > 1 ? 's ' : ' '}` : ''}{hours !== 0 ? `${hours} hour${hours > 1 ? 's ' : ' '}` : ''}{minutes !== 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : ''} {`(${distance} km)`}</Text>
                {
                  directionsPolyLine[selectedPolyLine]?.warnings &&
                  directionsPolyLine[selectedPolyLine]?.warnings.map((warning, index) => {
                    return (
                      <View style={styles.warningContainerBottomSheetDirection}>
                        <FontAwesome
                          name='warning'
                          size={20} 
                          color={app_c.HEX.third}
                        />
                        <Text style={styles.warningBottomSheetDirection}>{warning}</Text>
                      </View>
                    )
                  })
                }
              </View>
              <ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                height={40}
                style={styles.controlListContainer}
                // Phương: Only Ios
                contentInset={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 25
                }}
                // Phương: For android
                contentContainerStyle={{
                  paddingRight: Platform.OS === 'android' ? 25 : 0
                }}
              >
                <TouchableOpacity
                  style={styles.controlContainer}
                  onPress={() => {
                    setIsShowRoutePanel(true)
                    setIsShowDirectionsBottomSheet(false)
                    const edgePadding = {
                      top: 280,
                      right: 30,
                      bottom: 110,
                      left: 30
                    }
                    handleFitCoors(directionsPolyLine[selectedPolyLine]?.polyline, edgePadding, true)
                    // Đặt lại stepPolyLineSelected
                    setStepPolyLineSelected(-1)
                    // Đặt lại stepPolyLine
                    setStepPolyLine([])
                  }}
                >
                  <FontAwesome 
                    name='map' 
                    size={20} 
                    color={app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color: app_c.HEX.third
                  }]}
                  >Xem bản đồ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlContainer}
                  onPress={() => {
                    setIsShowRoutePanel(true)
                    setIsShowDirectionsBottomSheet(false)
                    const edgePadding = {
                      top: 280,
                      right: 30,
                      bottom: 110,
                      left: 30
                    }
                    handleFitCoors(directionsPolyLine[selectedPolyLine]?.polyline, edgePadding, true)
                    // Đặt lại stepPolyLineSelected
                    setStepPolyLineSelected(-1)
                    // Đặt lại stepPolyLine
                    setStepPolyLine([])
                  }}
                >
                  <FontAwesome5 
                    name='location-arrow' 
                    size={20} 
                    color={app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color: app_c.HEX.third
                  }]}
                  >Bắt đầu</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.controlContainer}
                  onPress={() => {
                    
                  }}
                >
                  <FontAwesome
                    name='bookmark' 
                    size={20} 
                    color={app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color: app_c.HEX.third
                  }]}
                  >Lưu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlContainer}
                  onPress={() => handleShareButton()}
                >
                  <FontAwesome5
                    name='share' 
                    size={20} 
                    color={app_c.HEX.third}
                  />
                  <Text style={[styles.controlText, {
                    color: app_c.HEX.third
                  }]}
                  >Chia sẻ</Text>
                </TouchableOpacity> */}
              </ScrollView>
              <View style={{
                width: '100%',
                height: 1,
                backgroundColor: app_c.HEX.ext_third
              }}/>
            </BottomSheetView>
            
            <BottomSheetVirtualizedList
              data={directionsPolyLine[selectedPolyLine]?.legs[0]?.steps}
              keyExtractor={(item, index) => `step-${index}`}
              getItemCount={(data) => data.length}
              getItem={(data, index) => data[index]}
              contentContainerStyle={{
                paddingBottom: 120,
                display: 'flex',
                marginTop: 20,
                backgroundColor: app_c.HEX.primary
              }}
              renderItem={({item, index}) => {
                let data, title, icon, desc, data1, title1, icon1, desc1
                
                  if (item?.navigationInstruction) {
                    data = (maneuverData.find(m => m.id === item?.navigationInstruction.maneuver))
                    title = data?.vi
                    icon =  data?.icon
                    desc = item?.navigationInstruction.instructions
                  } else {
                    data = (maneuverData.find(m => m.id === 'STRAIGHT'))
                    title = data?.vi
                    icon =  data?.icon
                    desc = 'Đi thẳng về phía trước'
                  }

                  if (index === 0) {
                    data1 = (maneuverData.find(m => m.id === 'LOCATION'))
                    title1 = data1?.vi
                    icon1 =  data1?.icon
                    desc1 = data1?.desc_vi
                  }
                
                const distanceStep = item.distanceMeters
                const secondsTranformYet = item.staticDuration

                const daysStep = Math.floor(secondsTranformYet / 86400)
                const hoursStep =  Math.floor((secondsTranformYet - (daysStep * 86400)) / 3600)
                const minutesStep = Math.floor((secondsTranformYet - (daysStep * 86400) - (hoursStep * 3600)) / 60)
                const secondsStep = Math.floor((secondsTranformYet - (daysStep * 86400) - (hoursStep * 3600) - (minutesStep * 60)) )
                if (index !== 0) {
                  // if (item?.navigationInstruction) {
                    return (
                      <TouchableOpacity style={[styles.containerDirections, {backgroundColor: stepPolyLineSelected===index+1 ? app_c.HEX.ext_primary : app_c.HEX.primary}]} onPress={() => {
                        // Mới đầu di chuyên máy quay đến start và end location
                        const edgePadding = {
                          top: 30,
                          right: 70,
                          bottom: 450,
                          left: 70
                        }
                        handleFitCoors([item?.startLocation?.latLng, item?.endLocation?.latLng], edgePadding, true)
                        // Sau đó đặt thanh màu khác để biết đó là thằng step
                        setStepPolyLine(item?.polyline)
                        // Kéo bottomSheet xuống dưới để nhìn
                        directionBottomSheetRef?.current.snapToIndex(1)
                        // Đặt để biết thằng nào chọn r
                        setStepPolyLineSelected(index+1)
                      }}>
                        <View style={styles.containerTextDirections}>
                          <Text style={styles.tilteDirections}>{title}</Text>
                          <Text style={styles.descDirections}>{desc}</Text>
                          <View style={styles.timeContainerDirections}>
                            <Text style={styles.timecDirections}>{daysStep !== 0 ? `${daysStep} day${daysStep > 1 ? 's ' : ' '}` : ''}{hoursStep !== 0 ? `${hoursStep} hour${hoursStep > 1 ? 's ' : ' '}` : ''}{minutesStep !== 0 ? `${minutesStep} min${minutesStep > 1 ? 's ' : ' '}` : ''}{secondsStep !== 0 ? `${secondsStep} second${secondsStep > 1 ? 's' : ''}` : ''}</Text>
                            <Octicons
                              name='dot-fill'
                              size={10}
                              color={app_c.HEX.ext_second}
                              style={{ marginHorizontal: 5}}
                            />
                            <Text style={styles.discDirections}>{distanceStep}m</Text>
                          </View>
                        </View>
                        <View style={styles.containerIconDirection}>
                          <Image source={icon} style={{height: 30, width: 30, tintColor: app_c.HEX.ext_second}}/>
                        </View>
                      </TouchableOpacity>
                    )
                  // }
                }
                else 
                  return (
                    <>
                      <TouchableOpacity style={[styles.containerDirections, {backgroundColor: stepPolyLineSelected===0 ? app_c.HEX.ext_primary : app_c.HEX.primary}]} onPress={() => {
                        const edgePadding = {
                          top: 30,
                          right: 150,
                          bottom: 450,
                          left: 150
                        }
                        // Mình sẽ tạo ra thêm 2 thằng nữa để phục vụ animate ngay chỗ mình
                        const freeCoor1 = computeDestinationPoint(
                          origin,
                          1000,
                          180
                        )

                        const freeCoor2 = computeDestinationPoint(
                          origin,
                          1000,
                          0
                        )

                        handleFitCoors([freeCoor1, origin, freeCoor2], edgePadding, true)
                        // Kéo bottomSheet xuống dưới để nhìn
                        directionBottomSheetRef?.current.snapToIndex(1)
                        // Đặt để biết thằng nào chọn r
                        setStepPolyLineSelected(index)
                        // Nên đặt thằng setStepPolyLine về []
                        setStepPolyLine([])
                      }}>
                      <View style={styles.containerTextDirections}>
                        <Text style={styles.tilteDirections}>{title1}</Text>
                        <Text style={styles.descDirections}>{desc1}</Text>
                      </View>
                      <View style={styles.containerIconDirection}>
                        <Image source={icon1} style={{height: 30, width: 30, tintColor: app_c.HEX.ext_second}}/>
                      </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={[styles.containerDirections, {backgroundColor: stepPolyLineSelected===index+1 ? app_c.HEX.ext_primary : app_c.HEX.primary}]} onPress={() => {
                        // Mới đầu di chuyên máy quay đến start và end location
                        const edgePadding = {
                          top: 30,
                          right: 70,
                          bottom: 450,
                          left: 70
                        }
                        handleFitCoors([item?.startLocation?.latLng, item?.endLocation?.latLng], edgePadding, true)
                        // Sau đó đặt thanh màu khác để biết đó là thằng step
                        setStepPolyLine(item?.polyline)
                        // Kéo bottomSheet xuống dưới để nhìn
                        directionBottomSheetRef?.current.snapToIndex(1)
                        // Đặt để biết thằng nào chọn r
                        setStepPolyLineSelected(index+1)
                      }}>
                        <View style={styles.containerTextDirections}>
                          <Text style={styles.tilteDirections}>{title}</Text>
                          <Text style={styles.descDirections}>{desc}</Text>
                          <View style={styles.timeContainerDirections}>
                            <Text style={styles.timecDirections}>{daysStep !== 0 ? `${daysStep} day${daysStep > 1 ? 's ' : ' '}` : ''}{hoursStep !== 0 ? `${hoursStep} hour${hoursStep > 1 ? 's ' : ' '}` : ''}{minutesStep !== 0 ? `${minutesStep} min${minutesStep > 1 ? 's ' : ' '}` : ''}{secondsStep !== 0 ? `${secondsStep} second${secondsStep > 1 ? 's' : ''}` : ''}</Text>
                            <Octicons
                              name='dot-fill'
                              size={10}
                              color={app_c.HEX.ext_second}
                              style={{ marginHorizontal: 5}}
                            />
                            <Text style={styles.discDirections}>{distanceStep}m</Text>
                          </View>
                        </View>
                        <View style={styles.containerIconDirection}>
                          <Image source={icon} style={{height: 30, width: 30, tintColor: app_c.HEX.ext_second}}/>
                        </View>
                      </TouchableOpacity>
                    </>
                  )
              }}
            />
          </View>
        }
      />
    </>
  )
}

export default memo(Map)