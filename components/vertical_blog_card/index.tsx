import { Image, View, ViewProps, StyleProp, TextStyle } from "react-native";
import React from "react";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import { FC } from "..";
import { RectangleButton } from "../buttons";

// Import hocs
import { withBlogActions } from "@/hocs/with-blog-actions";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useReportSection } from "@/hooks/useReport";

// Import utils
import { ComponentUtils } from "@/utils/component";
import { DatetimeUtils } from "@/utils/datetime";

// Import styles
import styles from "./styles";
import { Styles } from "@/styles";

// Import types
import type { Blog } from "@/objects/blog/type";
import type { VerticalBlogCardProps } from "./type";
import type { WithBlogActions_WrappedComponentProps } from "@/hocs/with-blog-actions/type";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Đây là card dọc, hiển thị một số thông tin cơ bản của một blog nào đó. Có thể ấn vào để xem chi tiết
 * một blog nào đó. Card dọc này sẽ ít thông tin và "khả năng tương tác" hơn so với card ngang.
 *
 * Có thể custom style cho component này (Container only). Chủ yếu là dùng để margin.
 *
 * __How to add style?__
 * ```jsx
 * // Margin end cho card
 * <VerticalBlogCard blog={blog[0]} style={app_sp.me_18} />
 * ```
 * @param {VerticalBlogCardProps} props Props của component.
 * @returns Thẻ dọc chứa các thông tin cơ bản của một blog.
 */
function _VerticalBlogCard({
  data,
  type,
  isChatBotScreen,
  actions,
  ...props
}: VerticalBlogCardProps & WithBlogActions_WrappedComponentProps) {
  const containerStyle = ComponentUtils.mergeStyle(styles.card, props.style);

  //theme
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { reportSectionDispatchers } = useReportSection();
  const _languageData = (language.data as any)["homeScreen"] as any;

  let displayAuthorName =
    data.author.lastName && data.author.firstName
      ? data.author.lastName + " " + data.author.firstName
      : data.author.displayName;

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
          onPress={actions.navigate}
        >
          <Image
            source={{ uri: data.coverImage ? data.coverImage : undefined }}
            style={[styles.card_image, { backgroundColor: theme.subOutline }]}
          />
        </RectangleButton>
        {/* Button & Recommended tag */}
        <View style={styles.card_mid}>
          {!data.author.avatar ? (
            <Ionicons name="person-circle" size={14} color={theme.outline} />
          ) : (
            <Image
              source={{ uri: data.coverImage }}
              style={styles.card_user_avatar}
            />
          )}
          <FC.AppText size="body2">{" " + displayAuthorName}</FC.AppText>
        </View>

        {/* Content */}
        <View style={styles.card_content_container}>
          <FC.AppText numberOfLines={2} size="h4" style={Styles.spacings.mb_6}>
            {data.name}
          </FC.AppText>

          {/* Sub-information */}
          <View style={styles.card_content_sub_information_container}>
            <FC.AppText size="body2">
              {data.createdAt
                ? DatetimeUtils.getShortDateStr(data.createdAt)
                : ""}
            </FC.AppText>
            <FC.AppText numberOfLines={1} size="body2">
              {data.readTime ? DatetimeUtils.toMinute(data.readTime) : 0} min
            </FC.AppText>
          </View>
        </View>

        {/* Like button */}
        <View
          style={[
            styles.card_buttons_container,
            {
              borderTopColor: theme.outline,
              borderTopWidth: 1,
            },
          ]}
        >
          <RectangleButton
            isActive={data.isLiked}
            isTransparent
            type="opacity"
            style={[styles.card_button, { alignItems: "center" }]}
            onPress={actions.toggleLike}
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
          </RectangleButton>

          <RectangleButton
            isTransparent
            type="opacity"
            style={[styles.card_button, { alignItems: "center" }]}
            onPress={() => {
              reportSectionDispatchers.openReportSection(data._id!, "blog");
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
          </RectangleButton>
        </View>
      </View>
    ),
    [data.isLiked, data, theme]
  );
}

const VerticalBlogCard = withBlogActions(_VerticalBlogCard);
export default VerticalBlogCard;
