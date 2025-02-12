import { View, ImageBackground, Image } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import AppText from "../app_text";
import RectangleButton from "../buttons/RectangleButton";
import CircleButton from "../buttons/CircleButton";

// import hocs
import { withBlogActions } from "@/hocs/with-blog-actions";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import utils
import { DatetimeUtils } from "@/utils/datetime";

// Import styles
import { Styles } from "@/styles";
import styles from "./styles";

// Import types
import type { HorizontalBlogCardProps } from "./type";
import type { WithBlogActions_WrappedComponentProps } from "@/hocs/with-blog-actions/type";

/**
 * __Creator__: @NguyenAnhTuan1912
 *
 * Đây là card nằm ngang, hiển thị một số thông tin cơ bản của một blog nào đó. Có thể ấn vào để xem chi tiết
 * của blog đó. Một card sẽ chứa 3 cột. Cột đâu tiên là dành cho ảnh, cột thứ 2 là giành cho nội dung chính
 * và cột cuói cùng là giành cho nút share.
 * @param props Props của component.
 * @returns Thẻ ngang chứa các thông tin cơ bản của một blog.
 */
function _HorizontalBlogCard({
  data,
  blogIndex,
  type,
  actions,
  ...props
}: HorizontalBlogCardProps & WithBlogActions_WrappedComponentProps) {
  const displayAuthorName =
    data.author.lastName && data.author.firstName
      ? data.author.lastName + " " + data.author.firstName
      : data.author.displayName;

  const { theme, currentScheme } = useTheme();

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
            style={[
              styles.card_image_container,
              { backgroundColor: theme.subBackground },
            ]}
            source={data.avatar !== "" ? { uri: data.avatar } : {}}
          >
            {/*
            blog.isRecommended &&
            <View style={styles.card_recommended_mark_container}>
              <AppText size="body6" style={{color: app_c.HEX.ext_second}}>Recommended</AppText>
            </View>
          */}
          </ImageBackground>
        </RectangleButton>

        {/* Cột thứ 2 - Main Container */}
        <View style={styles.card_main_container}>
          <View style={styles.card_content_container}>
            <View style={styles.card_user_container}>
              {!data.author.avatar ? (
                <Ionicons
                  name="person-circle"
                  size={18}
                  color={theme.secondary}
                />
              ) : (
                <Image
                  source={{ uri: data.author.avatar }}
                  style={styles.card_user_avatar}
                />
              )}
              <AppText size="body2">{" " + displayAuthorName}</AppText>
            </View>
            <View>
              <AppText numberOfLines={2} size="h3" style={styles.card_title}>
                {data.name}
              </AppText>
            </View>
            <View style={styles.card_information_container}>
              <View style={styles.card_information_col}>
                <AppText size="body2">
                  {DatetimeUtils.getShortDateStr(data.createdAt!)}
                </AppText>
              </View>
              <View
                style={{
                  ...styles.card_information_col,
                  alignItems: "flex-end",
                }}
              >
                <AppText size="body2">
                  <Ionicons name="time-outline" />{" "}
                  {DatetimeUtils.toMinute(data.readTime ? data.readTime : 0)}{" "}
                  min
                </AppText>
              </View>
            </View>
          </View>
          <View style={styles.card_buttons_container}>
            <CircleButton
              isActive={data.isLiked}
              border={1}
              defaultColor="type_5"
              activeColor="type_1"
              style={Styles.spacings.me_8}
              type="highlight"
              onPress={actions.like}
              setIcon={
                <Ionicons
                  name={data.isLiked ? "heart" : "heart-outline"}
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
              setIcon={<Ionicons name="flag" size={14} />}
            />
          </View>
        </View>

        {/* Cột thứ 3 - Share Container */}
        <View style={styles.card_share_container}>
          <CircleButton
            isOnlyContent={true}
            setIcon={<Ionicons name="share-outline" size={20} />}
            onPress={actions.share}
          />
        </View>
      </View>
    ),
    [data.isLiked, currentScheme]
  );
}

const HorizontalBlogCard = withBlogActions(_HorizontalBlogCard);
export default HorizontalBlogCard;
