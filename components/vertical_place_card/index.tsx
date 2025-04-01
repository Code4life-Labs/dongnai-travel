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

// Import hocs
import { withPlaceActions } from "@/hocs/with-place-actions";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useReportSection } from "@/hooks/useReport";

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
import { VerticalPlaceCardProps } from "./type";
import type { WithPlaceActions_WrappedComponentProps } from "@/hocs/with-place-actions/type";

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
 * @param props Props của component.
 * @returns Thẻ dọc chứa các thông tin cơ bản của một địa điểm.
 */
function _VerticalPlaceCard({
  data,
  type,
  isChatBotScreen,
  getTextContentInHTMLTag,
  actions,
  ...props
}: VerticalPlaceCardProps & WithPlaceActions_WrappedComponentProps) {
  const containerStyle = ComponentUtils.mergeStyle(
    [styles.card, data.isRecommended ? {} : {}],
    props.style
  );
  //theme
  const { reportSectionDispatchers } = useReportSection();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const _languageData = (language.data as any)["homeScreen"] as any;

  let presentationImage = data && data.photos ? { uri: data.photos[0] } : {};
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
          onPress={actions.navigate}
        >
          <ImageBackground
            source={presentationImage}
            style={[styles.card_image]}
          />
        </FC.RectangleButton>
        {/* Button & Recommended tag */}
        <View style={styles.card_mid}>
          {data.isRecommended && (
            <FC.AppText size="sub1" color="onSubBackground">
              {_languageData.recommended[language.code]}
            </FC.AppText>
          )}
        </View>

        {/* Content */}
        <View style={styles.card_content_container}>
          <FC.AppText numberOfLines={1} size="h4" style={Styles.spacings.mb_6}>
            {data.name}
          </FC.AppText>

          {/* Sub-information */}
          <View style={styles.card_content_sub_information_container}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <View style={[{ flexDirection: "row" }, Styles.spacings.me_6]}>
                  <Ionicons name="star-outline" />
                  <FC.AppText size="body2">{data.rating || 0}</FC.AppText>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="chatbubble-outline" />
                  <FC.AppText size="body2">
                    {NumberUtils.toMetricNumber(data.totalReviews || 0)}
                  </FC.AppText>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={[{ flexDirection: "row" }, Styles.spacings.me_6]}>
                  <Ionicons name="heart-outline" />
                  <FC.AppText size="body2">
                    {NumberUtils.toMetricNumber(data.totalFavorites || 0)}
                  </FC.AppText>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="compass-outline" />
                  <FC.AppText size="body2">
                    {NumberUtils.toMetricNumber(data.totalVisits || 0)}
                  </FC.AppText>
                </View>
              </View>
            </View>
            <FC.AppText numberOfLines={1} size="body2">
              <Ionicons name="location-outline" />{" "}
              {PlaceManager.getAddressShort(data)}
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
              onPress={actions.navigate}
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
              isActive={data.isFavorited}
              isTransparent
              type="opacity"
              style={[styles.card_button, { alignItems: "center" }]}
              onPress={actions.toggleFavorite}
            >
              {(isActive: boolean, currentLabelStyle: StyleProp<TextStyle>) => [
                <Ionicons
                  key="icon"
                  name={isActive ? "heart" : "heart-outline"}
                  style={[currentLabelStyle as any, Styles.spacings.me_6]}
                  size={14}
                />,
                <FC.AppText key="text" size="body2" style={currentLabelStyle}>
                  {!isActive
                    ? _languageData["like"][language.code]
                    : _languageData["liked"][language.code]}
                </FC.AppText>,
              ]}
            </FC.RectangleButton>

            <FC.RectangleButton
              isTransparent
              type="opacity"
              style={[styles.card_button, { alignItems: "center" }]}
              onPress={() => {
                reportSectionDispatchers.openReportSection(data._id!, "place");
              }}
            >
              {(isActive: boolean, currentLabelStyle: StyleProp<TextStyle>) => [
                <Ionicons
                  key="icon"
                  name={isActive ? "flag" : "flag-outline"}
                  style={[currentLabelStyle as any, Styles.spacings.me_6]}
                  size={14}
                />,
                <FC.AppText key="text" size="body2" style={currentLabelStyle}>
                  {_languageData["report"][language.code]}
                </FC.AppText>,
              ]}
            </FC.RectangleButton>
          </View>
        )}
      </View>
    ),
    [data.isFavorited, data.rating, data, theme]
  );
}

const VerticalPlaceCard = withPlaceActions(_VerticalPlaceCard);
export default VerticalPlaceCard;
