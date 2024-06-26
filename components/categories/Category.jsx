import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from './CategoryStyles'
import { app_typo, app_c, app_dms, app_shdw, app_sp, app_sh } from 'globals/styles'


import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { BottomSheetScrollView, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { useNavigation, useRoute } from '@react-navigation/native'
import { typesPlace } from '../../utilities/mapdata'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentFilter, updateCategories } from 'redux/filter/FilterSlice'
import { FilterConstants } from 'utilities/constants'
import { cloneDeep } from 'lodash'
import { useEffect } from 'react'
import { FlatList } from 'react-native'

const Category = ({
  label,
  childHeader,
  labelBtnStyle,
  handleLabelBtn
}) => {
  const ASPECT_RATIO = app_dms.screenWidth / app_dms.screenHeight
  const LATITUDE_DELTA = 0.3
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
  const INITIAL_POSITION = {
    latitude: 10.9160571,
    longitude: 106.8323861,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }
  const route = useRoute()
  const navigation = useNavigation()

  const dispatch = useDispatch()
  const currentFilter = useSelector(selectCurrentFilter)

  const [category, setCategory] = useState(route.params.category)
  const [categoryFull, setCategoryFull] = useState(null)

  const handlePressCategory = (typePlace) => {
    setCategoryFull(typePlace)
    setCategory(typePlace.id)
  }

  const handlePressOk = () => {
    if (categoryFull)
      navigation.navigate('FilterScreen', {
        category: categoryFull
      })
    else 
      navigation.goBack()
  }

  return (
    <View style={{ backgroundColor: app_c.HEX.primary, flex: 1}}>
      <BottomSheetView>
      <View style={styles.headerTextFilterContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.leftHeaderBtnFilter}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={25}
            color={app_c.HEX.fourth}
          />
        </TouchableOpacity>
        <Text style={styles.headerTextFilter}>Category</Text>
        <TouchableOpacity
          onPress={handlePressOk}
          style={styles.rightHeaderBtnFilter}
        >
          <Text style={styles.rightHeaderBtnTextFilter}>Ok</Text>
        </TouchableOpacity>
      </View> 
      <FlatList
          data={typesPlace}
          keyExtractor={(item, index) => {`type-${index}`}}
          style={styles.bodyFilterContainer}
          renderItem={({item, index}) => 
            <View 
              key={`type-${index}`}
              style={[styles.cardContainer, {
                marginBottom: index === typesPlace.length - 1 ? 160 : 0
              }]}
            >
              {
                index !== 0 &&
                <View style={styles.saperate}/>
              }
              <TouchableOpacity 
              onPress={() => handlePressCategory(item)}
              style={styles.cardCategoryContain}
              >
                <Text 
                  style={[styles.cardCategoryText, {
                    color: category === item.id ? app_c.HEX.third : app_c.HEX.ext_third
                  }]}
                  
                >{item[item.id].en}</Text>
                {
                  category === item.id &&
                  <Ionicons 
                    name='md-checkmark-circle' 
                    size={20} 
                    color={app_c.HEX.third}
                  />
                }
              </TouchableOpacity>
            </View>
          }
        />
      </BottomSheetView>
    </View>
  )
}

export default Category