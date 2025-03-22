import * as React from "react";
import {
  View,
  ImageBackground,
  ViewProps,
  StyleProp,
  TextStyle,
  Image,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import { FC } from "..";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import objects
import { PlaceManager } from "@/objects/place";

// Import utils
import { ComponentUtils } from "@/utils/component";
import { StringUtils } from "@/utils/string";
import { NumberUtils } from "@/utils/number";

// Import styles
import { Styles } from "@/styles";
import styles from "./styles";

// Import types
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
  const _languageData = (language.data as any)["homeScreen"] as any;

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
        <FC.RectangleButton
          isOnlyContent
          type="none"
          shape="rounded_4"
          onPress={handlePressImageButton}
        >
          <ImageBackground
            source={presentationImage}
            style={[styles.card_image]}
          />
        </FC.RectangleButton>
        {/* Button & Recommended tag */}
        <View style={styles.card_mid}>
          {place.isRecommended && (
            <FC.AppText size="sub1" color="onSubBackground">
              {_languageData.recommended[language.code]}
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
            <View>
              <View style={{ flexDirection: "row" }}>
                <View style={[{ flexDirection: "row" }, Styles.spacings.me_6]}>
                  <Ionicons name="star-outline" />
                  <FC.AppText size="body2">{place.rating || 0}</FC.AppText>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="chatbubble-outline" />
                  <FC.AppText size="body2">
                    {NumberUtils.toMetricNumber(place.totalReviews || 0)}
                  </FC.AppText>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={[{ flexDirection: "row" }, Styles.spacings.me_6]}>
                  <Ionicons name="heart-outline" />
                  <FC.AppText size="body2">
                    {NumberUtils.toMetricNumber(place.totalFavorites || 0)}
                  </FC.AppText>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="compass-outline" />
                  <FC.AppText size="body2">
                    {NumberUtils.toMetricNumber(place.totalVisits || 0)}
                  </FC.AppText>
                </View>
              </View>
            </View>
            <FC.AppText numberOfLines={1} size="body2">
              <Ionicons name="location-outline" />{" "}
              {PlaceManager.getAddressShort(place)}
            </FC.AppText>
          </View>
        </View>

        {/* Like button */}
        {isChatBotScreen ? (
          <>
            <FC.RectangleButton
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
            </FC.RectangleButton>
          </>
        ) : (
          <View
            style={[
              styles.card_buttons_container,
              { borderTopColor: theme.outline, borderTopWidth: 1 },
            ]}
          >
            <FC.RectangleButton
              isActive={extendedPlaceInfo.isLiked}
              isTransparent
              type="opacity"
              style={styles.card_button}
              onPress={handleLikeButton}
            >
              {(isActive: boolean, currentLabelStyle: StyleProp<TextStyle>) => (
                <>
                  <Ionicons
                    name={isActive ? "heart" : "heart-outline"}
                    style={[currentLabelStyle as any, Styles.spacings.me_6]}
                    size={14}
                  />{" "}
                  <FC.AppText size="body2" style={currentLabelStyle}>
                    {!isActive
                      ? _languageData["like"][language.code]
                      : _languageData["liked"][language.code]}
                  </FC.AppText>
                </>
              )}
            </FC.RectangleButton>

            <FC.RectangleButton
              isTransparent
              type="opacity"
              style={styles.card_button}
              onPress={() => {
                router.navigate({ pathname: "/reports" });
              }}
            >
              {(isActive: boolean, currentLabelStyle: StyleProp<TextStyle>) => (
                <>
                  <Ionicons
                    name={isActive ? "flag" : "flag-outline"}
                    style={[currentLabelStyle as any, Styles.spacings.me_6]}
                    size={14}
                  />{" "}
                  <FC.AppText size="body2" style={currentLabelStyle}>
                    {_languageData["report"][language.code]}
                  </FC.AppText>
                </>
              )}
            </FC.RectangleButton>
          </View>
        )}
      </View>
    ),
    [extendedPlaceInfo.isLiked, place.rating, place, theme]
  );
};

export default VerticalPlaceCard;
