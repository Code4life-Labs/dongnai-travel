import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import StarRating from 'components/star_rating/StarRating'
import axios from 'axios'
import { Buffer } from 'buffer'
import { Linking } from 'react-native'
import { styles } from './ImagePromiseStyles'
import moment from 'moment/moment'
import 'moment/locale/vi'  // without this line it didn't work
import { app_c } from 'globals/styles'
moment.locale('vi')

const ImagePromise = ({ photoReference, styleImage, map_api_key, pushArrImgBase64, isTranformData, fromChatBot=false, fromDetailItinerary=false}) => {
  
  const [urlBase64, setUrlBase64] = useState(null)
  
  useEffect(() => {
    getUrlBase64()
  }, [photoReference])
  
  const getUrlBase64 = async () => {
    if (!isTranformData) {
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${map_api_key}`
      console.log("🚀 ~ file: ImagePromise.jsx:26 ~ getUrlBase64 ~ url:", url)
      const res = await axios.get(url, {responseType: 'arraybuffer'})
      const urlBase64Decode = Buffer.from(res.data, 'binary').toString('base64')
      // console.log("🚀 ~ file: ImagePromise.jsx:25 ~ getUrlBase64 ~ urlBase64Decode:", urlBase64Decode)
      setUrlBase64(prev => urlBase64Decode)
      typeof pushArrImgBase64 === 'function' && pushArrImgBase64(`data:image/jpeg;base64,${urlBase64Decode}`)
    } else {
      setUrlBase64(photoReference)
      typeof pushArrImgBase64 === 'function' && pushArrImgBase64(`data:image/jpeg;base64,${photoReference}`)
    }
  }
  if (urlBase64) {
    console.log("🚀 ~ file: ImagePromise.jsx:37 ~ ImagePromise ~ urlBase64")
    return (
    <Image
      source={{uri: `data:image/jpeg;base64,${urlBase64}`}}
      style={styleImage}
    />
    )
  } else if (fromChatBot && !urlBase64) {
    return (
      <View
        style={[styles.imageCardDay, {backgroundColor: app_c.HEX.ext_primary}]}
      />
    )
  } else if (fromDetailItinerary && !urlBase64) {
    return (
      <View
        style={[styles.imageCardDay, {backgroundColor: app_c.HEX.ext_primary}]}
      />
    )
  }
}

export default ImagePromise