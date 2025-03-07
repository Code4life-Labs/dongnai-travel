import * as React from "react";
import { View, Text, Image, ViewProps } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import RectangleButton from "@/components/buttons/RectangleButton";

import styles from "./VerticalPlaceCardStyles";

// import {
//   PlaceDataProps,
// } from "types/index.d.ts";
import { useTheme } from "@/hooks/useTheme";
import { Styles } from "@/styles";
import { usePlaces } from "@/hooks/usePlace";
import { FC } from "..";
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
  //theme
  const { theme } = useTheme();
  // const { language } = useLanguage();
  // const _languageData = (language.data as any)["exploreScreen"] as any;

  // let [city, province] = getTextContentInHTMLTag(place.adr_address);
  // let presentationImage =
  //   place && place.place_photos ? { uri: place.place_photos[0] } : {};

  return React.useMemo(
    () => (
      <View
        {...props}
        style={[styles.card, props.style, { backgroundColor: theme.primary }]}
      >
        {/* Image */}
        <RectangleButton
          isOnlyContent
          typeOfButton="none"
          overrideShape="rounded_4"
          onPress={handlePressImageButton}
        >
          {/* <Image source={presentationImage} style={[styles.card_image]} /> */}
        </RectangleButton>
        {/* Button & Recommended tag */}
        <View style={styles.card_mid}>
          {/* {place.isRecommended && (
            <AppText font="sub1" color="third">
              Recommanded
            </AppText>
          )} */}
          <FC.AppText font="sub1" color="third">
            Recommanded
          </FC.AppText>
        </View>

        {/* Content */}
        <View style={styles.card_content_container}>
          <FC.AppText numberOfLines={1} font="h4" style={Styles.spacings.mb_6}>
            {/* {place.name} */}
            place name
          </FC.AppText>

          {/* Sub-information */}
          <View style={styles.card_content_sub_information_container}>
            <FC.AppText font="body2">
              <Ionicons name="star-outline" /> 
              {/* {place.rating} */}
              rating
            </FC.AppText>
            <FC.AppText numberOfLines={1} font="body2">
              <Ionicons name="location-outline" />{" "}
              {/* {StringUtility.toTitleCase(city)} */}
              city
              {/* {province && " - "} */}
              {/* {StringUtility.toTitleCase(province)} */}
              province
            </FC.AppText> 
          </View>
        </View>

        {/* Like button */}
        {isChatBotScreen ? (
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
                <FC.AppText style={currentLabelStyle} font="body2">
                  Khám phá ngay
                </FC.AppText>
              )}
            </RectangleButton>
          </>
        ) : (
          <View
            style={[
              styles.card_buttons_container,
              { borderTopColor: theme.outline, borderTopWidth: 1 },
            ]}
          >
            <RectangleButton
              // isActive={extendedPlaceInfo.isLiked}
              isActive={true}
              isTransparent
              typeOfButton="opacity"
              style={styles.card_button}
              onPress={handleLikeButton}
            >
              {(isActive, currentLabelStyle) => (
                <FC.AppText font="body2" style={currentLabelStyle}>
                  <Ionicons
                    name={isActive ? "heart" : "heart-outline"}
                    style={currentLabelStyle}
                    size={14}
                  />{" "}
                  {/* {langData.like[langCode]} */}
                  Like
                </FC.AppText>
              )}
            </RectangleButton>

            <RectangleButton
              isTransparent
              typeOfButton="opacity"
              style={styles.card_button}
            >
              {(isActive, currentLabelStyle) => (
                <FC.AppText font="body2" style={currentLabelStyle}>
                  <Ionicons
                    name={isActive ? "flag" : "flag-outline"}
                    style={currentLabelStyle}
                    size={14}
                  />
                  {/* {langData.report[langCode]} */}
                  Report
                </FC.AppText>
              )}
            </RectangleButton>
          </View>
        )}
      </View>
    ),
    [
      // extendedPlaceInfo.isLiked,
      // place.rating,
      // place.user_favorites_total,
      // place.user_ratings_total,
      // themeMode,
    ]
  );
};

export default VerticalPlaceCard;
