import React from "react";
import { View, ImageBackground, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import components
import AppText from "../app_text";
import RectangleButton from "../buttons/RectangleButton";
import CircleButton from "../buttons/CircleButton";

// Import hocs
import { withPlaceActions } from "@/hocs/with-place-actions";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

// Import objects
import { PlaceManager } from "@/objects/place";

// Import styles
import { Styles } from "@/styles";

// Import utils
import { StringUtils } from "@/utils/string";
import { NumberUtils } from "@/utils/number";

// Import from local
// Import styles
import { styles } from "./styles";

// Import types
import type { HorizontalPlaceCardProps } from "./type";
import type { WithPlaceActions_WrappedComponentProps } from "@/hocs/with-place-actions/type";

/**
 * Đây là card nằm ngang, hiển thị một số thông tin cơ bản của một địa điểm nào đó. Có thể ấn vào để xem chi tiết
 * một địa điểm nào đó. Một card sẽ chứa 3 cột. Cột đâu tiên là dành cho ảnh, cột thứ 2 là giành cho nội dung chính
 * và cột cuói cùng là giành cho nút share.
 * @param props Props của component.
 * @returns Thẻ ngang chứa các thông tin cơ bản của một địa điểm.
 * @NguyenAnhTuan1912
 */
function _HorizontalPlaceCard({
  data,
  type,
  getTextContentInHTMLTag,
  actions,
  ...props
}: HorizontalPlaceCardProps & WithPlaceActions_WrappedComponentProps) {
  const { theme, currentScheme } = useTheme();
  const { language } = useLanguage();

  const _languageData = (language.data as any)["exploreScreen"] as any;

  let presentationImage = data && data.photos ? { uri: data.photos[0] } : {};

  return React.useMemo(
    () => (
      <View style={[styles.card, { backgroundColor: theme.subBackground }]}>
        {/* Cột đâu tiên - Image Container */}
        <RectangleButton
          isOnlyContent
          type="none"
          shape="rounded_4"
          onPress={actions.navigate}
          style={Styles.spacings.me_12}
        >
          <ImageBackground
            style={styles.card_image_container}
            source={presentationImage}
          >
            {data.isRecommended && (
              <View
                style={[
                  styles.card_recommended_mark_container,
                  { backgroundColor: theme.subBackground },
                ]}
              >
                <AppText size="body2" color="secondary">
                  {_languageData.place_card_recommended[language.code] ||
                    "Recommended"}
                </AppText>
              </View>
            )}
          </ImageBackground>
        </RectangleButton>

        {/* Cột thứ 2 - Main Container */}
        <View style={styles.card_main_container}>
          <View style={styles.card_content_container}>
            <View style={styles.card_tag_container}>
              <AppText size="body2" numberOfLines={1}>
                {data
                  .types!.map((type, index) =>
                    StringUtils.toTitleCase(type.name)
                  )
                  .join(", ")}
              </AppText>
            </View>
            <View>
              <AppText numberOfLines={1} size="h3" style={styles.card_title}>
                {data.name}
              </AppText>
              <AppText size="body2" numberOfLines={2}>
                {PlaceManager.getAddress(data)}
              </AppText>
            </View>
            <View style={styles.card_information_container}>
              <View style={styles.card_information_col}>
                <View style={styles.card_information_cell}>
                  <Ionicons name="star-outline" style={Styles.spacings.me_6} />
                  <AppText size="body2">
                    {NumberUtils.toMetricNumber(data.rating || 0)}
                  </AppText>
                </View>
                <View style={styles.card_information_cell}>
                  <Ionicons
                    name="chatbubble-outline"
                    style={Styles.spacings.me_6}
                  />
                  <AppText size="body2">
                    {NumberUtils.toMetricNumber(data.totalReviews || 0)}
                  </AppText>
                </View>
              </View>
              <View style={styles.card_information_col}>
                <View style={styles.card_information_cell}>
                  <Ionicons name="heart-outline" style={Styles.spacings.me_6} />
                  <AppText size="body2">
                    {NumberUtils.toMetricNumber(data.totalFavorites || 0)}
                  </AppText>
                </View>
                <View style={styles.card_information_cell}>
                  <Ionicons
                    name="compass-outline"
                    style={Styles.spacings.me_6}
                  />
                  <AppText size="body2">
                    {NumberUtils.toMetricNumber(data.totalVisits || 0)}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.card_buttons_container}>
            <CircleButton
              isActive={data.isFavorited}
              border={1}
              defaultColor="type_5"
              activeColor="type_1"
              style={Styles.spacings.me_8}
              type="highlight"
              onPress={actions.toggleFavorite}
              setIcon={
                <Ionicons
                  name={data.isFavorited ? "heart" : "heart-outline"}
                  size={14}
                />
              }
            />
            <CircleButton
              border={1}
              defaultColor="type_5"
              activeColor="type_1"
              style={Styles.spacings.me_8}
              type="highlight"
              onPress={() => Alert.alert("Navigate to map")}
              setIcon={<Ionicons name="map" size={14} />}
            />
          </View>
        </View>

        {/* Cột thứ 3 - Share Container */}
        <View style={styles.card_share_container}>
          <CircleButton
            isOnlyContent={true}
            setIcon={
              <Ionicons color={theme.primary} name="share-outline" size={20} />
            }
            onPress={actions.share}
          />
        </View>
      </View>
    ),
    [
      data.isFavorited,
      data.rating,
      data.totalFavorites,
      data.totalVisits,
      data.totalReviews,
      currentScheme,
    ]
  );
}

const HorizontalPlaceCard = withPlaceActions(_HorizontalPlaceCard);
export default HorizontalPlaceCard;
