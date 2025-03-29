import { Image, View, ViewProps, StyleProp, TextStyle } from "react-native";
import React from "react";
import { router } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useReportSection } from "@/hooks/useReport";

// Import components
import { FC } from "..";
import { RectangleButton } from "../buttons";

// Import utils
import { ComponentUtils } from "@/utils/component";
import { DatetimeUtils } from "@/utils/datetime";

// Import styles
import styles from "./styles";
import { Styles } from "@/styles";

// Import types
import { Blog } from "@/objects/blog/type";

// Định nghĩa kiểu dữ liệu cho Blog
interface BlogAuthor {
  _id?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
}

interface BlogDataProps {
  _id?: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  author: BlogAuthor;
  createdAt: number;
  readTime?: number;
  userCommentsTotal?: number;
  userFavoritesTotal?: number;
  isApproved?: boolean;
}

// Định nghĩa kiểu dữ liệu cho ExtendedBlogInfo
interface ExtendedBlogInfo {
  isLiked?: boolean;
}

// Định nghĩa kiểu dữ liệu cho props của component
interface VerticalBlogCardProps extends ViewProps {
  blog: Partial<Blog>;
  blogIndex?: number;
  typeOfBriefBlog?: string;
  extendedBlogInfo?: ExtendedBlogInfo;
  addBlogDetails?: (blog: BlogDataProps) => void;
  updateBriefBlog?: (
    blogIndex: number,
    typeOfBriefBlog: string,
    updatedData: any
  ) => void;
  getTextContentInHTMLTag?: (html: string) => string;
  handlePressImageButton?: () => void;
  handleLikeButton?: () => void;
}

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
 * @param {VerticalBlogCardProps} props Props của component.
 * @returns Thẻ dọc chứa các thông tin cơ bản của một blog.
 */
const VerticalBlogCard: React.FC<VerticalBlogCardProps> = ({
  blog,
  blogIndex,
  typeOfBriefBlog,
  extendedBlogInfo = { isLiked: false },
  addBlogDetails,
  updateBriefBlog,
  getTextContentInHTMLTag,
  handlePressImageButton = () => {},
  handleLikeButton = () => {},
  ...props
}) => {
  const containerStyle = ComponentUtils.mergeStyle(styles.card, props.style);

  //theme
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { reportSectionDispatchers } = useReportSection();
  const _languageData = (language.data as any)["homeScreen"] as any;

  let displayAuthorName =
    blog.author.lastName && blog.author.firstName
      ? blog.author.lastName + " " + blog.author.firstName
      : blog.author.displayName;

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
          <Image
            source={{ uri: blog.coverImage ? blog.coverImage : undefined }}
            style={[styles.card_image, { backgroundColor: theme.subBackground }]}
          />
        </RectangleButton>
        {/* Button & Recommended tag */}
        <View style={styles.card_mid}>
          {!blog.author.avatar ? (
            <Ionicons name="person-circle" size={14} color={theme.onBackground} />
          ) : (
            <Image
              source={{ uri: blog.coverImage }}
              style={[styles.card_user_avatar, { backgroundColor: theme.subBackground }]}
            />
          )}
          <FC.AppText size="body2">{" " + displayAuthorName}</FC.AppText>
        </View>

        {/* Content */}
        <View style={styles.card_content_container}>
          <FC.AppText numberOfLines={2} size="h4" style={Styles.spacings.mb_6}>
            {blog.name}
          </FC.AppText>

          {/* Sub-information */}
          <View style={styles.card_content_sub_information_container}>
            <FC.AppText size="body2">
              {blog.createdAt
                ? DatetimeUtils.getShortDateStr(blog.createdAt)
                : ""}
            </FC.AppText>
            <FC.AppText numberOfLines={1} size="body2">
              {blog.readTime ? DatetimeUtils.toMinute(blog.readTime) : 0} min
            </FC.AppText>
          </View>
        </View>

        {/* Like button */}
        <View
          style={[
            styles.card_buttons_container,
            {
              borderTopColor: theme.onBackground,
              borderTopWidth: 1,
            },
          ]}
        >
          <RectangleButton
            isActive={extendedBlogInfo.isLiked}
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
          </RectangleButton>

          <RectangleButton
            isTransparent
            type="opacity"
            style={styles.card_button}
            onPress={() => {
              reportSectionDispatchers.openReportSection(blog._id!, "blog");
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
          </RectangleButton>
        </View>
      </View>
    ),
    [
      extendedBlogInfo.isLiked,
      blog.name,
      blog.coverImage,
      blog.author,
      blog.createdAt,
      blog.readTime,
      theme,
    ]
  );
};

export default VerticalBlogCard;
