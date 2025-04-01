import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './FilterStyles'
import { app_typo, app_c, app_dms, app_shdw, app_sp, app_sh } from 'globals/styles'


import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import MapView, { Marker, PROVIDER_GOOGLE, Overlay} from 'react-native-maps'
import { BottomSheetScrollView, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { resetFilter, selectCurrentFilter, updateCategories, updateCurrentFilter, updateSortBy } from 'redux/filter/FilterSlice'
import { FilterConstants } from 'utilities/constants'
import { typesPlace } from 'utilities/mapdata'
import { cloneDeep } from 'lodash'
import InputAutoComplete from 'components/input_auto_complete/InputAutoComplete'
import { useRef } from 'react'
import { LogBox } from 'react-native'
import { selectCurrentLanguage } from 'redux/language/LanguageSlice'

const Filter = ({
  locationCurrent,
  closeTermCondition,
  bottomSheetExampleRef,
  map_api_key,
  arrPlaceInput
}) => {
  const route = useRoute()
  //language
  const langData = useSelector(selectCurrentLanguage).data?.filter
  const langCode = useSelector(selectCurrentLanguage).languageCode

  const navigation = useNavigation() 
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectCurrentFilter)

  const ASPECT_RATIO = app_dms.screenWidth / app_dms.screenHeight
  const LATITUDE_DELTA = 0.3
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
  const INITIAL_POSITION = {
    latitude: 10.984627414215625,
    latitudeDelta: 0.0023868747822710645,
    longitude: 106.86912897974253, 
    longitudeDelta: 0.0032964348793029785
  }

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

  const inputRef = useRef(null)

  const [isFocusedInput, setIsFocusedInput] = useState(false)

  const [category, setCategory] = useState(typesPlace.find( typePlace => typePlace.id === currentFilter.category) || null)
  const [coordinate, setCoordinate] = useState(null)

  const [sortBySelected, setSortBySelected] = useState(currentFilter.sortBy)
  const [priceLevels, setPriceLevels] = useState(currentFilter.priceLevels)
  const [radius, setRadius] = useState(currentFilter.radius)

  const [openReposition, setOpenReposition] = useState(false)

  const [locationToSave, setLocationToSave] = useState(currentFilter.location || locationCurrent)

  console.log(route.params)

  useEffect(() => {
    setCategory(typesPlace.find(typePlace => typePlace.id === currentFilter.category))
    setSortBySelected(currentFilter.sortBy)
    setPriceLevels(currentFilter.priceLevels)
    setRadius(currentFilter.radius)
    setLocationToSave(currentFilter.location || locationCurrent)
    setOpenReposition(false)
  } , [currentFilter])

  useEffect(() => {
    if (route.params)
      setCategory(route.params.category)
  } , [route])

  const handlePressSaveBtn = () => {
  //   let filterToUpdate = {
  //     type: category.id,
  //     sortBy: sortBySelected,
  //     radius: radius,
  //     location: locationToSave
  //   }

    // if (priceLevels[0] !== 0 || priceLevels[1] !== 5) {
    //   filterToUpdate = {
    //     ...filterToUpdate,
    //     minprice: priceLevels[0],
    //     maxprice: priceLevels[1]
    //   }
    // }
    // console.log("🚀 ~ file: Filter.jsx:63 ~ handlePressSaveBtn ~ filterToUpdate:", filterToUpdate)
    
    dispatch(updateCurrentFilter({
      category: category.id,
      sortBy: sortBySelected,
      priceLevels: priceLevels,
      radius: radius,
      location: locationToSave
    }))
    closeTermCondition()
    bottomSheetExampleRef.current?.close()
  }

  return (
    <View style={{ backgroundColor: app_c.HEX.primary, flex: 1}}>
      <BottomSheetView>
      <View style={styles.headerTextFilterContainer}>
        <TouchableOpacity
          onPress={() => null}
          style={styles.leftHeaderBtnFilter}
        >
            <Text style={styles.rightHeaderBtnTextFilter} onPress={() => dispatch(resetFilter())}>{langData.reset[langCode]}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTextFilter}>{langData.header_title[langCode]}</Text>
        <TouchableOpacity
          onPress={() => handlePressSaveBtn()}
          style={styles.rightHeaderBtnFilter}
        >
          <Text style={styles.rightHeaderBtnTextFilter}>{langData.save[langCode]}</Text>
        </TouchableOpacity>
      </View>
      </BottomSheetView>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 0,
          paddingBottom: 120,
          display: 'flex',
          // paddingHorizontal: 18,
          backgroundColor: app_c.HEX.primary
        }}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.bodyFilterContainer}>
          {/* Chọn loại hình */}
          <View style={styles.sectionSeclectMultipleFilterContainer}>
            <View 
              style={styles.sectionSeclectMultipleHeaderContainer}
            >
              <Text style={styles.sectionSeclectMultipleHeaderLeft}>{langData.category[langCode]}</Text>
              <TouchableOpacity 
              onPress={() => navigation.navigate('CategoriesScreen', {
                category: category.id 
              })}
              style={styles.sectionSeclectMultipleHeaderRight}>
                <Text style={styles.multipleHeaderRightText}>{langData.select_category[langCode]}</Text>
                <MaterialIcons 
                  name='arrow-forward-ios' 
                  size={18} 
                  color={app_c.HEX.ext_second}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.sectionSeclectMultipleBodyContainer}>
              {/* {
                currentFilter?.categories.length > 0 ?
                currentFilter.categories.map(category => {
                  const typePlace = typesPlace.find(typePlace => typePlace.id === category)
                  return(
                    <TouchableOpacity 
                      onPress={() => handleRemoveCategory(typePlace.id)}
                      key={`typePlace-${typePlace.id}`}
                      style={styles.sectionSeclectMultipleBodyItem}
                    >
                      <Text style={styles.bodyItemText}>{typePlace[typePlace.id]?.en}</Text>
                      <MaterialIcons 
                        name='highlight-remove' 
                        size={20} 
                        color={app_c.HEX.primary}
                      />
                    </TouchableOpacity>
                  )
                }) : 
              } */}
              <View style={styles.sectionSeclectMultipleBodySelectAll}>
                <Text style={styles.bodySelectAllText}>{category[category.id][langCode]}{" "}{langData.have_been_selected[langCode]}</Text>
              </View>

            </View>
          </View>

          <View style={styles.saperate}/>

          {/* Sắp xếp kết quả theo */}
          {/* 1. theo khoảng cách */}
          {/* 2. theo star */}
          <View style={styles.sectionSeclectMultipleFilterContainer}>
            <View style={styles.sectionSeclectMultipleHeaderContainer}>
              <Text style={styles.sectionSeclectMultipleHeaderLeft}>{langData.sort_by[langCode]}</Text>
              <View style={styles.sectionSeclectMultipleHeaderRight}>
              </View>
            </View>
            <View style={styles.sectionRadioList}>
              {
                FilterConstants.sortBy.map(s => {
                  return(
                    <TouchableOpacity 
                      key={`sortBy-${s.id}`}
                      onPress={() => setSortBySelected(s.id)}
                      style={styles.sectionRadioItem}
                    >
                      <Text style={[styles.sectionRadioItemText, {
                        color: s.id === sortBySelected ? app_c.HEX.third : app_c.HEX.ext_third
                      }]}>{s.tilte[langCode]}</Text>
                      {
                        s.id === sortBySelected ?
                        <Ionicons 
                          name='radio-button-on' 
                          size={20} 
                          color={app_c.HEX.third}
                        /> : 
                        <Ionicons 
                          name='radio-button-off' 
                          size={20} 
                          color={app_c.HEX.third}
                        /> 
                      }
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </View>

          <View style={styles.saperate}/>
          
          {/* Tìm Kiếm theo mức giá */}
          <View style={[styles.sectionSeclectMultipleFilterContainer, {marginTop: 10, marginBottom: 5}]}>
            <View style={styles.sectionSeclectMultipleHeaderContainer}>
              <Text style={styles.sectionSeclectMultipleHeaderLeft}>{langData.price_levels[langCode]}</Text>
              <View style={styles.sectionSeclectMultipleHeaderRight}>
              </View>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <MultiSlider
                values={priceLevels}
                sliderLength={app_dms.screenWidth - 48 - 36}
                min={0}
                max={5}
                step={1}
                markerOffsetY={15}
                snapped={true}
                containerStyle={{
                  marginBottom: 10,
                  paddingHorizontal: 18
                }}
                selectedStyle={{
                    backgroundColor: app_c.HEX.sub_fourth,
                }}
                trackStyle={{
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: app_c.HEX.sub_fourth,
                }}
                onValuesChange={e => setPriceLevels(e)}
                customMarker={(e) => {
                    return (
                        <View style={{
                            height: 45,
                            width: 70,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                height: 30,
                                width: 30,
                                borderRadius: 15,
                                borderWidth: 4,
                                borderColor: app_c.HEX.primary,
                                backgroundColor: app_c.HEX.third,
                                marginBottom: 5,
                                ...app_shdw.type_2,
                                marginHorizontal:15,
                            }}></View>
                            <Text style={{
                              color: app_c.HEX.ext_second,
                              ...app_typo.fonts.normal.lighter.h5
                            }}>
                          {langData.Level[langCode]} {e.currentValue}</Text>
                        </View>
                    )
                }}
            ></MultiSlider>
            </View>
          </View>
          
          <View style={styles.saperate}/>

          {/* Timg Kiếm trogn bán kính */}
          <View style={[styles.sectionSeclectMultipleFilterContainer, {marginTop: 10, marginBottom: 5,}]}>
            <View style={styles.sectionSeclectMultipleHeaderContainer}>
              <Text style={styles.sectionSeclectMultipleHeaderLeft}>{langData.search_within_radius[langCode]}</Text>
              <View style={styles.sectionSeclectMultipleHeaderRight}>
              </View>
            </View>
            <View style={styles.sectionRadiusContainer}>
              <BottomSheetTextInput 
                style={styles.sectionRadiusInput}
                value={radius}
                keyboardType='numeric'
                onChangeText={(e) => setRadius(e)}
              />
              <Text style={styles.sectionRadiusText}>{langData.meters[langCode]}</Text>
            </View>
          </View>
          
          <View style={styles.saperate}/>

          {/* Timf Kiếm theo địa điểm */}
          <View style={[styles.sectionSeclectMultipleFilterContainer, {marginTop: 15,}]}>
            <View style={styles.sectionSeclectMultipleHeaderContainer}>
              <Text style={styles.sectionSeclectMultipleHeaderLeft}>{langData.search_from_location[langCode]}</Text>
              <View style={styles.sectionSeclectMultipleHeaderRight}>
              </View>
            </View>

            <MapView
              style={{
                height: 250,
                width: '100%',
                ...app_sh.rounded_8,
                ...app_shdw.type_4,
                marginTop: 15
              }}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                ...locationToSave,
                latitudeDelta: 0.0023868747822710645,
                longitudeDelta: 0.0032964348793029785
              }}
              onRegionChangeComplete={e => {
                setCoordinate({
                  latitude: e.latitude,
                  longitude: e.longitude
                })
              }}
            >
              {
                !openReposition &&
                <Marker coordinate={locationToSave}/>
              }
            </MapView>
            {
              openReposition && 
              <MaterialIcons
                name="add-location-alt"
                size={40}
                color={app_c.HEX.third}
                style={[styles.iconLocation]}
              />
            }

            {
              !openReposition ?
              <TouchableOpacity 
                onPress={() => setOpenReposition(true)}
                style={styles.controlLocationBtn}
              >
                  <Text style={styles.controlLocationText}>{langData.reposition[langCode]}</Text>
              </TouchableOpacity> :
              <TouchableOpacity 
                onPress={() => {
                  setOpenReposition(false)
                  setLocationToSave(coordinate)
                }}
                style={styles.controlLocationBtn}
              >
                  <Text style={styles.controlLocationText}>{langData.save_location[langCode]}</Text>
              </TouchableOpacity>
            }

            {/* <View style={{position: 'absolute', left: 18, right: 18, top: 40}}>
              <InputAutoComplete
                placeholder='Choose a location'
                onPlaceSelected={(details) => {
                  console.log('details', {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  })
                  setLocationToSave({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  })
                }}
                isFocusedInput={isFocusedInput}
                handleFocus={(condition) => setIsFocusedInput(condition)}
                inputRef={inputRef}
                map_api_key={map_api_key}
                predefinedPlaces={arrPlaceInput}
                isHaveLeftButton={false}
                textInputStyle={styles.textInput}
                listViewStyle={styles.listView}
              />
            </View> */}
          </View>
        </View>
      </BottomSheetScrollView>
    </View>
  )
}

export default Filter