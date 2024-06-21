import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'

import {
  withBlogCard
} from 'hocs/withBlogCard'

import {
  useBlogDetailsActions
} from 'customHooks/useBlog'
import { useTheme } from 'customHooks/useTheme'

import { useNavigation } from '@react-navigation/native'

import DateTimeUtility from 'utilities/datetime'

import Ionicons from 'react-native-vector-icons/Ionicons'

import AppText from 'components/app_text/AppText'
import RectangleButton from 'components/buttons/RectangleButton'
import CircleButton from 'components/buttons/CircleButton'

import styles from './HorizontalBlogCardStyles'
import { app_c, app_shdw, app_sp } from 'globals/styles'

import {
  BlogDataProps,
  WithBlogCardWrapperdComponentProps
} from 'types/index.d.ts'

/**
 * @typedef HorizontalBlogCardProps
 * @property {BlogDataProps} blog Thông tin về một blog.
 * @property {string} typeOfBriefBlog Type của brief blogs.
 * @property {number} blogIndex Index của blog trong data của briefBlog. Cái này dùng để tìm blog cho nhanh, khỏi dùng vòng lặp.
 */

/**
 * __Creator__: @NguyenAnhTuan1912
 * 
 * Đây là card nằm ngang, hiển thị một số thông tin cơ bản của một blog nào đó. Có thể ấn vào để xem chi tiết
 * của blog đó. Một card sẽ chứa 3 cột. Cột đâu tiên là dành cho ảnh, cột thứ 2 là giành cho nội dung chính
 * và cột cuói cùng là giành cho nút share.
 * @param {WithBlogCardWrapperdComponentProps} props Props của component.
 * @returns Thẻ ngang chứa các thông tin cơ bản của một blog.
 */
const HorizontalBlogCard = ({
  blog,
  blogIndex,
  typeOfBriefBlog,
  extendedBlogInfo,
  addBlogDetails,
  updateBriefBlog,
  getTextContentInHTMLTag,
  handlePressImageButton,
  handleLikeButton,
  handleVisitButton,
  handleShareToSocial,
  ...props
}) => {
  let displayAuthorName = blog.author.lastName && blog.author.firstName
    ? blog.author.lastName + " " + blog.author.firstName
    : blog.author.displayName
  //theme
  const { theme, themeMode } = useTheme();

  return React.useMemo(() => (
    <View style={[styles.card,{backgroundColor: theme.subBackground, ...app_shdw.type_1}]}>
      {/* Cột đâu tiên - Image Container */}
      <RectangleButton
        typeOfButton="highlight"
        overrideShape="rounded_4"
        isOnlyContent={true}
        onPress={handlePressImageButton}
        style={app_sp.me_12}
      >
        <ImageBackground style={[styles.card_image_container, { backgroundColor: theme.subBackground }]} source={blog.avatar !== "" ? {uri: blog.avatar} : {}}>
          {/*
            blog.isRecommended &&
            <View style={styles.card_recommended_mark_container}>
              <AppText font="body6" style={{color: app_c.HEX.ext_second}}>Recommended</AppText>
            </View>
          */}
        </ImageBackground>
      </RectangleButton>
      {/* Cột thứ 2 - Main Container */}
      <View style={styles.card_main_container}>
        <View style={styles.card_content_container}>
          <View style={styles.card_user_container}>
            {
              !blog.author.avatar
              ? (<Ionicons name="person-circle" size={18} color={app_c.HEX.ext_second} />)
              : (<Image source={{uri: blog.author.avatar}} style={styles.card_user_avatar} />)
            }<AppText font="body2" style={styles.card_text_color}>{" " + displayAuthorName}</AppText>
          </View>
          <View>
            <AppText numberOfLines={2} font="h3" style={styles.card_title}>{blog.name}</AppText>
          </View>
          <View style={styles.card_information_container}>
            <View style={styles.card_information_col}>
              <AppText font="body2">
                {DateTimeUtility.getShortDateString(blog.createdAt)}
              </AppText>
            </View>
            <View style={{...styles.card_information_col, alignItems: 'flex-end'}}>
              <AppText font="body2" style={styles.card_text_color}>
                <Ionicons name='time-outline' /> {DateTimeUtility.toMinute(blog.readTime ? blog.readTime : 0)} min
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.card_buttons_container}>
          <CircleButton
            isActive={extendedBlogInfo.isLiked}
            border={1}
            defaultColor='type_5'
            activeColor='type_1'
            style={app_sp.me_8}
            typeOfButton="highlight"
            onPress={handleLikeButton}
            setIcon={<Ionicons name={extendedBlogInfo.isLiked ? 'heart' : 'heart-outline'} size={14} />}
          />
          <CircleButton
            border={1}
            defaultColor='type_5'
            activeColor='type_1'
            style={app_sp.me_8}
            typeOfButton="highlight"
            setIcon={<Ionicons name='flag' size={14} />}
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
  ), [extendedBlogInfo.isLiked, blog.userCommentsTotal, blog.userFavoritesTotal, themeMode]);
}

export default withBlogCard(HorizontalBlogCard)