import {
  View,
  ScrollView,
  Image,
  Animated,
  LayoutAnimation
} from 'react-native'
import React from 'react'

import {
  getBlogsAPI
} from 'apis/axios/blog/get'

import useTheme from 'customHooks/useTheme'
import { useAuthState } from 'customHooks/useAuth'
import {
  useBlogDetails,
  useBriefBlogs,
  useBlogInteractionActions,
  useBriefBlogsActions
} from 'customHooks/useBlog'

import { useSelector } from 'react-redux'
import { selectCurrentMode } from 'redux/theme/ThemeSlice'

import { BRIEF_BLOG_DATA_FIELDS } from 'utilities/constants'
import NumberUtility from 'utilities/number'
import DateTimeUtility from 'utilities/datetime'

import Ionicons from 'react-native-vector-icons/Ionicons'

import { withTheme } from 'hocs/withTheme'
import {
  AppText,
  CircleButton,
  RectangleButton,
  MarkFormat,
  Speech,
  HorizontalBlogCard
} from 'components'

import styles from './BlogDetailScreenStyle'
import { app_sp } from 'globals/styles'

const BlogDetailScreen = withTheme(({
  route,
  navigation,
  theme,
  themeMode
}) => {
  const { blogId, typeOfBriefBlog, fromSearch, handleShareToSocial } = route.params;
  
  const { user } = useAuthState();
  const { blogDetails, fetchBlogDetailsById, clearBlogDetails } = useBlogDetails(blogId);
  const { updateBriefBlog } = useBriefBlogsActions();
  const { extendedBlogInfo, likeBlog } = useBlogInteractionActions(blogDetails);

  const [relatedBlogs, setRelatedBlogs] = React.useState([]);
  // Dành để tranform thằng Float Buttons
  const floatButtonTranslateYAnim = React.useRef(new Animated.Value(0)).current;
  const offSetY = React.useRef(null);

  let type = blogDetails.type ? blogDetails.type : "";
  let displayAuthorName = blogDetails.author.lastName && blogDetails.author.firstName
    ? blogDetails.author.lastName + " " + blogDetails.author.firstName
    : blogDetails.author.displayName;

  const handleOnScroll = e => {
    let { contentOffset } = e.nativeEvent;
    let diff = contentOffset.y - (offSetY.current || 0);
    if(diff > 0) {
      toggleFloatButtonsVisible(1)
    } else {
      toggleFloatButtonsVisible(0)
    }
    offSetY.current  = contentOffset.y;
  };

  const handleLikeButton = () => likeBlog(
    (data, state) => updateBriefBlog(blogDetails._id, 0, { isLiked: state }),
    (state) => updateBriefBlog(blogDetails._id, 0, { isLiked: state })
  )

  const toggleFloatButtonsVisible = (val) => {
    Animated.spring(floatButtonTranslateYAnim,
      {
        toValue: val,
        useNativeDriver: true
      }
    ).start();
  };

  React.useEffect(() => {
    navigation.setOptions({'title': blogDetails.name});
    fetchBlogDetailsById(blogId, {
      canGetFull: true
    })

    if(relatedBlogs.length === 0) {
      let query = {
        limit: 5,
        skip: 0,
        quality: `type:${type},except_by_placeid:${blogDetails._id}`,
        fields: BRIEF_BLOG_DATA_FIELDS,
        userId: user._id
      };
      getBlogsAPI(query)
      .then(response => {
        let data = response.data;
        console.log('RELATED BLOGS: ', data)
        setRelatedBlogs(data);
      })
      .catch(console.error)
    }

    return function() {
      // clearBlogDetails(blogId);
    }
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <ScrollView
        style={[styles.bd_container, {backgroundColor: theme.background}]}
        contentContainerStyle={{paddingBottom: 120}}
        onScroll={handleOnScroll}
        scrollEventThrottle={1000}
      >
          {/* Author, Blog information section */}
        <View style={[styles.bd_header, app_sp.mt_12,{ borderBottomColor: theme.outline }]}>
          <View style={[styles.bd_row, app_sp.mb_12, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CircleButton
                isOnlyContent
                defaultColor='type_6'
                setIcon={
                  blogDetails.author.avatar
                  ? (
                    <Image style={styles.avatar} source={{uri: blogDetails.author.avatar}} />
                  )
                  : (
                    <Ionicons style={{margin: -6}} size={48} name="person-circle-outline" />
                  )}
              />

              {/* Author name and other information  */}
              <View style={app_sp.ms_12}>
                <AppText font="h5">{displayAuthorName}</AppText>
                <AppText font="sub1">{`${DateTimeUtility.getShortDateString(blogDetails.createdAt)} ${DateTimeUtility.toMinute(blogDetails.readTime)} min read.`}</AppText>
              </View>
            </View>

            {/* Follow button */}
            <RectangleButton
              defaultColor="type_5"
              overrideShape="capsule"
              style={app_sp.pv_0}
            >
              {/* {extendedBlogInfo.isLiked ? 'Following' : 'Follow'} */}
              Follow
            </RectangleButton>
          </View>
          
          <View style={[styles.bd_row, app_sp.mb_12]}>
            <AppText font="h2">{blogDetails.name}</AppText>
          </View>

          <View style={[styles.bd_row, app_sp.mb_12]}>
          <CircleButton
            defaultColor="type_5"
            style={app_sp.me_8}
            typeOfButton="highlight"
            setIcon={<Ionicons name='share-outline' size={14} />}
            onPress={handleShareToSocial}
          />
          <CircleButton
            defaultColor="type_5"
            style={app_sp.me_8}
            typeOfButton="highlight"
            setIcon={<Ionicons name='flag' size={14} />}
          />
          </View>

          {/* Tags */}
          <View style={styles.bd_row}>
            <AppText font="body2" style={app_sp.me_12}>
              <Ionicons name='pricetag-outline' /> Thể loại:
            </AppText>
            <RectangleButton
              defaultColor="type_5"
              typeOfButton="highlight"
              overrideShape="rounded_4"
              style={[app_sp.ph_8, app_sp.pv_0, app_sp.me_6]}
            >
              {blogDetails.type}
              {/* {
                (isActive, currentLabelStyle) => (<AppText font="body3" style={currentLabelStyle}>{blogDetails.type}</AppText>)
              } */}
            </RectangleButton>
          </View>

          {/* Speech, tạm thời vẫn chưa có, cho nên là chờ ở đây thôi */}
          <Speech
            text={blogDetails.content?.plainText}
            // content={blogDetails.content?.speech}
            lang='vi'
            style={app_sp.mt_12}
          />
        </View>

        {/* Blog Content */}
        <View style={styles.bd_content_container}>
          {/* Dùng MarkFormat ở đây */}
          {
            blogDetails.content
            && (
              <MarkFormat
                text={blogDetails.content.plainTextMarkFormat}
              />
            )
          }
        </View>

        <View style={[styles.bd_content_container, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
          <AppText font="h3" numberOfLines={1} style={app_sp.mb_6}>Related Blogs</AppText>
          <CircleButton
            isTransparent
            typeOfButton="highlight"
            setIcon={<Ionicons name="chevron-forward-outline" size={18} />}
          />
        </View>
        <View>
          {
            relatedBlogs.length === 0
            ? 
            <View style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              {/* <AppText>{langData.relatedPlacesDataMessage[langCode]}</AppText> */}
              <Image 
                source={require('../../assets/images/no-data.png')} 
                style={styles.imageNoData}/>
            </View>
            : (
              relatedBlogs.map(relatedBlog => (
                <HorizontalBlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))
            )
          }
        </View>
      </ScrollView>

      {/* Float container */}
      <Animated.View style={[
        styles.float_button_container,
        {
          backgroundColor: theme.subBackground,
          transform: [
            {
              translateY: floatButtonTranslateYAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100]
              })
            }
          ]
        }
      ]}>
        <View
          style={[app_sp.me_6, {
            flexDirection: 'row',
            alignItems: 'center'
          }]}
        >
          <CircleButton
            isActive={extendedBlogInfo.isLiked}
            defaultColor="type_5"
            activeColor="type_1"
            style={app_sp.me_6}
            typeOfButton="highlight"
            setIcon={<Ionicons name={extendedBlogInfo.isLiked ? 'heart' : 'heart-outline'} size={14} />}
            onPress={handleLikeButton}
          />
          <AppText font="body3">{NumberUtility.toMetricNumber(blogDetails.userFavoritesTotal)}</AppText>
        </View>
        <View style={styles.seperate}/>
        <View style={[app_sp.me_12, { flexDirection: 'row', alignItems: 'center' }]}>
          <CircleButton
            defaultColor="type_5"
            style={app_sp.me_6}
            typeOfButton="highlight"
            onPress={() => { navigation.navigate("GlobalNavigator", { screen: "BlogCommentScreen", params: { blogId: blogDetails._id } }) }}
            setIcon={<Ionicons name="chatbox-outline" size={14} />}
          />
          <AppText font="body3">{NumberUtility.toMetricNumber(blogDetails.userCommentsTotal)}</AppText>
        </View>
      </Animated.View>
    </View>
  )
});

export default BlogDetailScreen