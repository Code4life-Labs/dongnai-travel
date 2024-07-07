import React from "react";
import { View, ImageBackground, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Import from components
import AppText from "../app_text";
import RectangleButton from "../buttons/RectangleButton";
import CircleButton from "../buttons/CircleButton";

// Import from hocs
import { withPlaceActions } from "@/hocs/with_place_actions";

// Import from hooks
import { useTheme } from "@/hooks/useTheme";

// Import from styles
import { Styles } from "@/styles";

// Import from utils
import { StringUtils } from "@/utils/string";
import { NumberUtils } from "@/utils/number";

// Import from local
// Import styles
import { styles } from "./styles";

// Import types
import type { HorizontalPlaceCardProps } from "./type";
import type { WithPlaceActions_WrappedComponentProps } from "@/hocs/with_place_actions/type";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Đây là card nằm ngang, hiển thị một số thông tin cơ bản của một địa điểm nào đó. Có thể ấn vào để xem chi tiết
 * một địa điểm nào đó. Một card sẽ chứa 3 cột. Cột đâu tiên là dành cho ảnh, cột thứ 2 là giành cho nội dung chính
 * và cột cuói cùng là giành cho nút share.
 * @param props Props của component.
 * @returns Thẻ ngang chứa các thông tin cơ bản của một địa điểm.
 */
function HorizontalPlaceCard({
  data,
  placeIndex,
  type,
  getTextContentInHTMLTag,
  actions
  ...props
}: HorizontalPlaceCardProps & WithPlaceActions_WrappedComponentProps) {
  const navigation = useNavigation();
  // const langCode = useSelector(selectCurrentLanguage).languageCode
  // const langData = useSelector(selectCurrentLanguage).data?.exploreScreen
  const { theme } = useTheme();

  let presentationImage =
    place && place.place_photos ? { uri: place.place_photos[0] } : {};

  return React.useMemo(
    () => (
      <View style={[styles.card, { backgroundColor: theme.subBackground }]}>
        {/* Cột đâu tiên - Image Container */}
        <RectangleButton
          isOnlyContent
          type="none"
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
              type="highlight"
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

export default withPlaceActions(HorizontalPlaceCard);
