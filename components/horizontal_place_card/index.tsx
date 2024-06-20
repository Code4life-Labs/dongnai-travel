import React from "react";
import { View, Text, ImageBackground, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

import { useTheme } from "hooks/useTheme";
import { selectCurrentLanguage } from "states/redux/language/LanguageSlice";

import NumberUtility from "utilities/number";
import StringUtility from "utilities/string";

import { withPlaceCard } from "hocs/withPlaceCard";
import AppText from "../app_text/AppText";
import RectangleButton from "../buttons/RectangleButton";
import CircleButton from "../buttons/CircleButton";

import styles from "./HorizontalPlaceCardStyles";
import { app_sp, app_shdw } from "globals/styles";

import {
  PlaceDataProps,
  WithPlaceCardWrappedComponentProps,
} from "types/index.d.ts";
/**
 * @typedef HorizontalPlaceCardProps
 * @property {PlaceDataProps} place Thông tin về một địa điểm của một nơi nào đó.
 * @property {string} typeOfBriefPlace Type của brief places.
 * @property {number} placeIndex Index của place trong data của briefPlace. Cái này dùng để tìm place cho nhanh, khỏi dùng vòng lặp.
 */

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Đây là card nằm ngang, hiển thị một số thông tin cơ bản của một địa điểm nào đó. Có thể ấn vào để xem chi tiết
 * một địa điểm nào đó. Một card sẽ chứa 3 cột. Cột đâu tiên là dành cho ảnh, cột thứ 2 là giành cho nội dung chính
 * và cột cuói cùng là giành cho nút share.
 * @param {WithPlaceCardWrappedComponentProps} props Props của component.
 * @returns Thẻ ngang chứa các thông tin cơ bản của một địa điểm.
 */
function HorizontalPlaceCard({
  place,
  placeIndex,
  typeOfBriefPlace,
  extendedPlaceInfo,
  addPlaceDetails,
  updateBriefPlace,
  getTextContentInHTMLTag,
  handlePressImageButton,
  handleLikeButton,
  handleShareToSocial,
  ...props
}) {
  const navigation = useNavigation();
  // const langCode = useSelector(selectCurrentLanguage).languageCode
  // const langData = useSelector(selectCurrentLanguage).data?.exploreScreen
  const { theme, themeMode } = useTheme();

  let [city, province] = getTextContentInHTMLTag(place.adr_address);
  let presentationImage =
    place && place.place_photos ? { uri: place.place_photos[0] } : {};

  return React.useMemo(
    () => (
      <View style={[styles.card, { backgroundColor: theme.subBackground }]}>
        {/* Cột đâu tiên - Image Container */}
        <RectangleButton
          isOnlyContent
          typeOfButton="none"
          overrideShape="rounded_4"
          onPress={handlePressImageButton}
          style={app_sp.me_12}
        >
          <ImageBackground
            style={styles.card_image_container}
            source={presentationImage}
          >
            {place.isRecommended && (
              <View style={styles.card_recommended_mark_container}>
                <AppText font="body2" color="ext_second">
                  {langData.place_card_recommended[langCode]}
                </AppText>
              </View>
            )}
          </ImageBackground>
        </RectangleButton>

        {/* Cột thứ 2 - Main Container */}
        <View style={styles.card_main_container}>
          <View style={styles.card_content_container}>
            <View style={styles.card_tag_container}>
              <AppText font="body2" numberOfLines={1}>
                {place.types
                  .map((type, index) => StringUtility.toTitleCase(type))
                  .join(", ")}
              </AppText>
            </View>
            <View>
              <AppText numberOfLines={1} font="h3" style={styles.card_title}>
                {place.name}
              </AppText>
              <AppText font="body2">
                {StringUtility.toTitleCase(city)}
                {province && " - "}
                {StringUtility.toTitleCase(province)}
              </AppText>
            </View>
            <View style={styles.card_information_container}>
              <View style={styles.card_information_col}>
                <AppText font="body2">
                  <Ionicons name="star-outline" /> {place.rating}
                </AppText>
                <AppText font="body2">
                  <Ionicons name="chatbubble-outline" />{" "}
                  {NumberUtility.toMetricNumber(place.user_ratings_total)}
                </AppText>
              </View>
              <View style={styles.card_information_col}>
                <AppText font="body2">
                  <Ionicons name="heart-outline" />{" "}
                  {NumberUtility.toMetricNumber(place.user_favorites_total)}
                </AppText>
              </View>
            </View>
          </View>
          <View style={styles.card_buttons_container}>
            <CircleButton
              isActive={extendedPlaceInfo.isLiked}
              border={1}
              defaultColor="type_5"
              activeColor="type_1"
              style={app_sp.me_8}
              typeOfButton="highlight"
              onPress={handleLikeButton}
              setIcon={
                <Ionicons
                  name={extendedPlaceInfo.isLiked ? "heart" : "heart-outline"}
                  size={14}
                />
              }
            />
            <CircleButton
              border={1}
              defaultColor="type_5"
              activeColor="type_1"
              style={app_sp.me_8}
              typeOfButton="highlight"
              onPress={() => Alert.alert("Navigate to map")}
              setIcon={<Ionicons name="map" size={14} />}
            />
          </View>
        </View>

        {/* Cột thứ 3 - Share Container */}
        <View style={styles.card_share_container}>
          <CircleButton
            isOnlyContent={true}
            setIcon={<Ionicons name="share-outline" size={20} />}
            onPress={handleShareToSocial}
          />
        </View>
      </View>
    ),
    [
      extendedPlaceInfo.isLiked,
      place.rating,
      place.user_favorites_total,
      place.user_ratings_total,
      themeMode,
    ]
  );
}

export default withPlaceCard(HorizontalPlaceCard);
