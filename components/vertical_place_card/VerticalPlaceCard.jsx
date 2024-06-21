import {
  View,
  Text,
  Image,
  ViewProps
} from 'react-native'
import React from 'react'

import { useSelector } from 'react-redux'

import { useTheme } from 'customHooks/useTheme'

import { selectCurrentLanguage } from 'redux/language/LanguageSlice'

import ComponentUtility from 'utilities/component'
import StringUtility from 'utilities/string'

import Ionicons from 'react-native-vector-icons/Ionicons'

import { withPlaceCard } from 'hocs/withPlaceCard'
import AppText from 'components/app_text/AppText'
import RectangleButton from 'components/buttons/RectangleButton'

import styles from './VerticalPlaceCardStyles'
import { app_shdw, app_sp } from 'globals/styles'

import {
  PlaceDataProps,
  WithPlaceCardWrappedComponentProps
} from 'types/index.d.ts'
/**
 * @typedef VerticalPlaceCardProps
 * @property {PlaceDataProps} place Thông tin về một địa điểm của một nơi nào đó.
 * @property {string} typeOfBriefPlace Type của brief places.
 * @property {number} placeIndex Index của place trong data của briefPlace. Cái này dùng để tìm place cho nhanh, khỏi dùng vòng lặp.
 */

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Đây là card dọc, hiển thị một số thông tin cơ bản của một địa điểm nào đó. Có thể ấn vào để xem chi tiết
 * một địa điểm nào đó. Card dọc này sẽ ít thông tin và "khả năng tương tác" hơn so với card ngang.
 * 
 * Có thể custom style cho component này (Container only). Chủ yếu là dùng để margin.
 * 
 * __How to add style?__
 * ```jsx
 * // Margin end cho card 
 * <VerticalPlaceCard place={place[0]} style={app_sp.me_18} />
 * ```
 * @param {WithPlaceCardWrappedComponentProps} props Props của component.
 * @returns Thẻ dọc chứa các thông tin cơ bản của một địa điểm.
 */
const VerticalPlaceCard = ({
  place,
  placeIndex,
  typeOfBriefPlace,
  extendedPlaceInfo,
  addPlaceDetails,
  updateBriefPlace,
  getTextContentInHTMLTag,
  handlePressImageButton,
  handleLikeButton,
  isChatBotScreen = false,
  ...props
}) => {
  const containerStyle = ComponentUtility.mergeStyle([styles.card, place.isRecommended ? {} : {}], props.style);

  const langCode = useSelector(selectCurrentLanguage).languageCode
  const langData = useSelector(selectCurrentLanguage).data?.homeScreen

  //theme
  const { theme, themeMode } = useTheme();

  let [city, province] = getTextContentInHTMLTag(place.adr_address);
  let presentationImage = place && place.place_photos ? {uri: place.place_photos[0]} : {}

  return React.useMemo(() => (
    <View {...props} style={[containerStyle,{ backgroundColor: theme.subBackground }]}>
      {/* Image */}
      <RectangleButton
        isOnlyContent
        typeOfButton="none"
        overrideShape="rounded_4"
        onPress={handlePressImageButton}
      >
        <Image source={presentationImage} style={[styles.card_image, { backgroundColor: theme.subOutline }]} />
      </RectangleButton>
      {/* Button & Recommended tag */}
      <View style={styles.card_mid}>
        {
          place.isRecommended && <AppText font="sub1" color="third">{langData.recommended[langCode]}</AppText>
        }
      </View>

      {/* Content */}
      <View style={styles.card_content_container}>
        <AppText numberOfLines={1} font="h4" style={app_sp.mb_6}>{place.name}</AppText>

        {/* Sub-information */}
        <View style={styles.card_content_sub_information_container}>
          <AppText font="body2">
            <Ionicons name="star-outline" /> {place.rating}
          </AppText>
          <AppText numberOfLines={1} font="body2">
            <Ionicons name="location-outline" /> {StringUtility.toTitleCase(city)}{province && " - "}{StringUtility.toTitleCase(province)}
          </AppText>
        </View>
      </View>
      
      
      {/* Like button */}
      {
        isChatBotScreen ?
        <>
          <RectangleButton
            // isActive={extendedPlaceInfo.isVisited}
            // typeOfButton="highlight"
            overrideShape="capsule"
            onPress={handlePressImageButton}
            style={{
              marginTop: 5,
            }}
          >
            {(isActive, currentLabelStyle) => (
              <AppText style={currentLabelStyle} font="body2">Khám phá ngay</AppText>
            )}
          </RectangleButton>
        </> : 
        <View style={[styles.card_buttons_container, { borderTopColor: theme.outline, borderTopWidth: 1 }]}>
          <RectangleButton
            isActive={extendedPlaceInfo.isLiked}
            isTransparent
            typeOfButton="opacity"
            style={styles.card_button}
            onPress={handleLikeButton}
          >
            {
              (isActive, currentLabelStyle) => (
                <AppText font="body2" style={currentLabelStyle}>
                  <Ionicons name={isActive ? "heart" : "heart-outline"} style={currentLabelStyle} size={14} /> {langData.like[langCode]}
                </AppText>
              )
            }
          </RectangleButton>

          <RectangleButton
            isTransparent
            typeOfButton="opacity"
            style={styles.card_button}
          >
            {
              (isActive, currentLabelStyle) => (
                <AppText font="body2" style={currentLabelStyle}>
                <Ionicons name={isActive ? "flag" : "flag-outline"} style={currentLabelStyle} size={14} /> {langData.report[langCode]}
                </AppText>
              )
            }
          </RectangleButton>
        </View>
      }
    </View>
  ), [extendedPlaceInfo.isLiked, place.rating, place.user_favorites_total, place.user_ratings_total, themeMode])
}

export default withPlaceCard(VerticalPlaceCard)