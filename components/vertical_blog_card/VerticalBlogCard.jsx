import { Image } from "react-native";
import React from "react";

import { useNavigation } from "@react-navigation/native";

import { useTheme } from "@/hooks/useTheme";

import Ionicons from "react-native-vector-icons/Ionicons";


import styles from "./VerticalBlogCardStyles";
import { FC } from "..";
import { RectangleButton } from "../buttons";

// import {
//   BlogDetailsDataProps,
//   WithBlogCardWrapperdComponentProps
// } from 'types/index.d.ts'

/**
 * @typedef VerticalBlogCardProps
 * @property {BlogDetailsDataProps} blog Thông tin ngắn của một địa điểm.
 */

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
 * @param {WithBlogCardWrapperdComponentProps} props Props của component.
 * @returns Thẻ dọc chứa các thông tin cơ bản của một blog.
 */
const VerticalBlogCard = ({
  blog,
  blogIndex,
  typeOfBriefBlog,
  extendedBlogInfo,
  addBlogDetails,
  updateBriefBlog,
  getTextContentInHTMLTag,
  handlePressImageButton,
  handleLikeButton,
  ...props
}) => {
  // const containerStyle = ComponentUtility.mergeStyle(styles.card, props.style);
  //Đức useNavagation to make when onPress Image of Blog => toScreen BlogDetailScreen
  const navigation = useNavigation();

  //theme
  const { theme } = useTheme();

  let displayAuthorName =
    blog.author.lastName && blog.author.firstName
      ? blog.author.lastName + " " + blog.author.firstName
      : blog.author.displayName;

  return React.useMemo(
    () => (
      <View
        {...props}
        style={[
          styles.card,
          props.style,
          { backgroundColor: theme.background },
        ]}
      >
        {/* Image */}
        <RectangleButton
          RectangleButton
          isOnlyContent
          typeOfButton="none"
          overrideShape="rounded_4"
          onPress={handlePressImageButton}
        >
          <Image
            source={{ uri: blog.avatar ? blog.avatar : undefined }}
            style={[styles.card_image, { backgroundColor: theme.subOutline }]}
          />
        </RectangleButton>
        {/* Button & Recommended tag */}
        <View style={styles.card_mid}>
          {!blog.author.avatar ? (
            <Ionicons name="person-circle" size={14} color={theme.outline} />
          ) : (
            <Image
              source={{ uri: blog.author.avatar }}
              style={styles.card_user_avatar}
            />
          )}
          <FC.AppText font="body2">{" " + displayAuthorName}</FC.AppText>
        </View>

        {/* Content */}
        <View style={styles.card_content_container}>
          <FC.AppText numberOfLines={2} font="h4" style={Styles.spacings.mb_6}>
            {/* {blog.name} */}
            blog.name
          </FC.AppText>

          {/* Sub-information */}
          <View style={styles.card_content_sub_information_container}>
            <FC.AppText font="body2">
              {/* {DateTimeUtility.getShortDateString(blog.createdAt)} */}
              {/* TODO: fix this */}
              createdAt
            </FC.AppText>
            <FC.AppText numberOfLines={1} font="body2">
              {/* {DateTimeUtility.toMinute(blog.readTime ? blog.readTime : 0)} min */}
              {/* TODO: fix this */}
              readTime
            </FC.AppText>
          </View>
        </View>

        {/* Like button */}
        <View
          style={[
            styles.card_buttons_container,
            { borderTopColor: theme.outline, borderTopWidth: 1 },
          ]}
        >
          <RectangleButton
            isActive={extendedBlogInfo.isLiked}
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
                />{" "}
                Report
              </FC.AppText>
            )}
          </RectangleButton>
        </View>
      </View>
    ),
    [
      extendedBlogInfo.isLiked,
      blog.userCommentsTotal,
      blog.userFavoritesTotal,
      themeMode,
    ]
  );
};

export default VerticalBlogCard;
