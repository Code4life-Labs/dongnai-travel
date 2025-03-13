import * as React from "react";
import {
  View,
  ImageBackground,
  ViewProps,
  StyleProp,
  TextStyle,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import RectangleButton from "@/components/buttons/RectangleButton";

import styles from "./VerticalPlaceCardStyles";

import { useTheme } from "@/hooks/useTheme";
import { Styles } from "@/styles";
import { FC } from "..";
import { ComponentUtils } from "@/utils/component";
import { StringUtils } from "@/utils/string";
import { useLanguage } from "@/hooks/useLanguage";
import { PlaceManager } from "@/objects/place";
import { Place } from "@/objects/place/type";

// Định nghĩa kiểu dữ liệu cho Place
interface PlaceDataProps {
  name: string;
  place_photos?: string[];
  isRecommended?: boolean;
  rating?: number;
  user_favorites_total?: number;
  user_ratings_total?: number;
  // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa kiểu dữ liệu cho ExtendedPlaceInfo
interface ExtendedPlaceInfo {
  isLiked?: boolean;
  isVisited?: boolean;
}

// Định nghĩa kiểu dữ liệu cho props của component
interface VerticalPlaceCardProps extends ViewProps {
  place: Partial<Place>;
  placeIndex?: number;
  typeOfBriefPlace?: string;
  extendedPlaceInfo?: ExtendedPlaceInfo;
  addPlaceDetails?: (place: PlaceDataProps) => void;
  updateBriefPlace?: (
    placeIndex: number,
    typeOfBriefPlace: string,
    updatedData: any
  ) => void;
  getTextContentInHTMLTag?: (html: string) => string;
  handlePressImageButton?: () => void;
  handleLikeButton?: () => void;
  isChatBotScreen?: boolean;
}

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
 * @param {VerticalPlaceCardProps} props Props của component.
 * @returns Thẻ dọc chứa các thông tin cơ bản của một địa điểm.
 */
const VerticalPlaceCard: React.FC<VerticalPlaceCardProps> = ({
  place,
  placeIndex,
  typeOfBriefPlace,
  extendedPlaceInfo = {},
  addPlaceDetails,
  updateBriefPlace,
  getTextContentInHTMLTag,
  handlePressImageButton = () => {},
  handleLikeButton = () => {},
  isChatBotScreen = false,
  ...props
}) => {
  const containerStyle = ComponentUtils.mergeStyle(
    [styles.card, place.isRecommended ? {} : {}],
    props.style
  );
  //theme
  const { theme } = useTheme();
  const { language } = useLanguage();
  const _languageData = (language.data as any)["exploreScreen"] as any;
  console.log("🚀 ~ place:", place);

  let presentationImage = place && place.photos ? { uri: place.photos[0] } : {};
  return React.useMemo(
    () => (
      <View
        {...props}
        style={
          [
            containerStyle,
            { backgroundColor: theme.background },
          ] as StyleProp<any>
        }
      >
        {/* Image */}
        <RectangleButton
          isOnlyContent
          type="none"
          shape="rounded_4"
          onPress={handlePressImageButton}
        >
          <ImageBackground
            source={presentationImage}
            style={[styles.card_image]}
          />
        </RectangleButton>
        {/* Button & Recommended tag */}
        <View style={styles.card_mid}>
          {place.isRecommended && (
            <FC.AppText size="sub1" color="onSubBackground">
              {_languageData.place_card_recommended[language.code]}
            </FC.AppText>
          )}
        </View>

        {/* Content */}
        <View style={styles.card_content_container}>
          <FC.AppText numberOfLines={1} size="h4" style={Styles.spacings.mb_6}>
            {place.name}
          </FC.AppText>

          {/* Sub-information */}
          <View style={styles.card_content_sub_information_container}>
            <FC.AppText size="body2">
              <Ionicons name="star-outline" />
              {place.rating}
            </FC.AppText>
            <FC.AppText numberOfLines={1} size="body2">
              <Ionicons name="location-outline" />{" "}
              {PlaceManager.getAddressShort(place)}
            </FC.AppText>
          </View>
        </View>

        {/* Like button */}
        {isChatBotScreen ? (
          <>
            <RectangleButton
              // isActive={extendedPlaceInfo.isVisited}
              // type="highlight"
              shape="capsule"
              onPress={handlePressImageButton}
              style={{
                marginTop: 5,
              }}
            >
              {(isActive: boolean, currentLabelStyle: StyleProp<TextStyle>) => (
                <FC.AppText style={currentLabelStyle} size="body2">
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
              isActive={extendedPlaceInfo.isLiked}
              isTransparent
              type="opacity"
              style={styles.card_button}
              onPress={handleLikeButton}
            >
              {(isActive: boolean, currentLabelStyle: StyleProp<TextStyle>) => (
                <FC.AppText size="body2" style={currentLabelStyle}>
                  <Ionicons
                    name={isActive ? "heart" : "heart-outline"}
                    style={currentLabelStyle as any}
                    size={14}
                  />{" "}
                  {/* {langData.like[langCode]} */}
                  Like
                </FC.AppText>
              )}
            </RectangleButton>

            <RectangleButton
              isTransparent
              type="opacity"
              style={styles.card_button}
            >
              {(isActive: boolean, currentLabelStyle: StyleProp<TextStyle>) => (
                <FC.AppText size="body2" style={currentLabelStyle}>
                  <Ionicons
                    name={isActive ? "flag" : "flag-outline"}
                    style={currentLabelStyle as any}
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
      extendedPlaceInfo.isLiked,
      place.rating,
      place,
      theme,
    ]
  );
};

export default VerticalPlaceCard;
