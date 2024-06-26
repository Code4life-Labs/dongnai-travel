import {
  View,
  Image,
  StyleSheet,
  ActionSheetIOS,
  ViewProps,
  ViewStyle,
  Alert,
  Animated,
  Pressable
} from 'react-native'
import React from 'react'

import { deleteBlogCommentAPI } from 'apis/axios/blog/delete'

import { useTheme } from 'customHooks/useTheme'

import DateTimeUtility from 'utilities/datetime'

import Ionicons from 'react-native-vector-icons/Ionicons'

import AppText from '../app_text/AppText'
import CircleButton from '../buttons/CircleButton'
import RectangleButton from '../buttons/RectangleButton'
import { app_c, app_sp, app_shdw } from 'globals/styles'

/**
 * @typedef CommentAuthorDataProps
 * @property {string} _id `_id` của người comment.
 * @property {string} displayName Tên hiển thị của người dùng, tuỳ theo việc mà người dùng có setup display name hay không.
 * @property {string} lastName Họ của người dùng.
 * @property {string} firstName Tên của người dùng.
 * @property {string} avatar Ảnh đại diện của người dùng.
 */

/**
 * @typedef CommentDataProps
 * @property {string} _id `_id`của comment.
 * @property {string} blogId `_id` của blog.
 * @property {string} exactKey `_id` của blog list.
 * @property {string} text Nội dung của blog.
 * @property {CommentAuthorDataProps} author Dữ liệu của author.
 * @property {number} createdAt Comment được tạo vào thời điểm nào.
 * @property {number} updatedAt Comment được sửa đổi vào lúc nào.
 */

/**
 * @typedef CommentProps
 * @property {CommentDataProps} comment Dữ liệu về comment.
 * @property {boolean} isOwnedCurrentUser Cho biết là comment này có thuộc về user hay không?
 */

/**
 * Component này dùng để hiển thị ra comment của người dùng. Nó sẽ nhận một object như sau
 * @param {ViewProps & CommentProps} props
 * @returns 
 */
const Comment = ({
  comment,
  isOwnedCurrentUser,
  ...props
}) => {
  let authorName = comment.author.lastName && comment.author.firstName
    ? `${comment.author.lastName} ${comment.author.firstName}`
    : comment.author.displayName
  ;

  let { type, distance } = DateTimeUtility.getTimeDistance(comment.createdAt);

  const { theme } = useTheme();

  const [commentInfo, setCommentInfo] = React.useState({
    isDeleted: false,
    isActionsVisible: false
  });
  const floatActionsScaleAnim = React.useRef(new Animated.Value(0)).current;

  const handleToggleFloatActionsPress = React.useCallback((function() {
    let actionsVisible = false;
    return function() {
      console.log("Toggle: ", actionsVisible);
      Animated.spring(floatActionsScaleAnim, {
        toValue: actionsVisible ? 0 : 1,
        useNativeDriver: true
      }).start();
      actionsVisible = !actionsVisible
      setCommentInfo(prevState => ({...prevState, isActionsVisible: actionsVisible}));
    }
  })(), []);

  const handleDeleteCommentPress = () => {
    let data = {
      blogId: comment.blogId,
      blogCommentId: comment._id,
      exactKey: comment.exactKey
    }

    deleteBlogCommentAPI(data)
    .then((response) => {
      console.log("Delete response: ", response.data);
      setCommentInfo(prevState => ({...prevState, isDeleted: true}))
    })
    .catch(console.error)
  }

  if(commentInfo.isDeleted) return null;

  return (
    <View {...props} style={[{borderBottomColor: theme.outline, borderBottomWidth: 1}, app_sp.pb_12, props.style]}>
      {
        commentInfo.isActionsVisible && (
          <Pressable
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0
            }}
            onPress={handleToggleFloatActionsPress}
          />
        )
      }
      {/* Information and Actions Container */}
      <View style={styles.comment_info_n_actions_container}>
        {/* Basic user info container */}
        <View style={styles.comment_author_info_container}>
          <View style={app_sp.me_12}>
            {
              comment.author.avatar
              ? (
                <Image style={{width: 42, aspectRatio: 1, borderRadius: 9999}} source={{uri: comment.author.avatar}} />
              )
              : (
                <Ionicons style={{margin: -6}} color={theme.onBackground} size={48} name="person-circle-outline" />
              )
            }
          </View>
          <View>
            <AppText font="h4">{authorName}</AppText>
            <AppText font="sub1">{distance} {type}</AppText>
          </View>
        </View>

        <View style={{position: "relative", zIndex: 2}}>
          <Ionicons
            name="ellipsis-horizontal"
            size={18}
            onPress={() => {
              console.log("Scale change: ", floatActionsScaleAnim);
              handleToggleFloatActionsPress();
              // setActionsVisible(prevState => !prevState);
            }}
          />
          <Animated.View
            style={[
              styles.comment_float_action_buttons_container,
              app_shdw.type_1,
              {
                transform: [
                  {
                    scale: floatActionsScaleAnim,
                  }
                ]
              }
            ]}
          >
            {
              isOwnedCurrentUser ? (
                <>
                  <RectangleButton
                    defaultColor="type_4"
                    typeOfButton="opacity"
                    onPress={() => {Alert.alert("Tính năng này đang được phát triển!")}}
                  >Edit</RectangleButton>
                  <RectangleButton
                    defaultColor="type_4"
                    typeOfButton="opacity"
                    onPress={handleDeleteCommentPress}
                  >
                    {
                      (isActive, currentLabelStyle) => (<AppText style={[currentLabelStyle, { color: 'red' }]}>Delete</AppText>)
                    }
                  </RectangleButton>
                </>
              ) : (
                <RectangleButton
                  defaultColor="type_4"
                  typeOfButton="opacity"
                  onPress={() => {Alert.alert("Tính năng này đang được phát triển!")}}
                >
                  {
                    (isActive, currentLabelStyle) => (<AppText style={[currentLabelStyle, { color: 'red' }]}>Report</AppText>)
                  }
                </RectangleButton>
              )
            }
          </Animated.View>
        </View>
      </View>

      {/* Text */}
      <AppText style={[app_sp.mv_12, {position: "relative", zIndex: 1}]}>{comment.text}</AppText>

      <View style={[styles.comment_interact_buttons_container]}>
        {/* <CircleButton
          typeOfButton="highlight"
          setIcon={(isActive, currentLabelStyle) => (
            <Ionicons name='heart-outline' size={14} style={currentLabelStyle} />
          )}
        /> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  },

  comment_info_n_actions_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 2
  },

  comment_author_info_container: {
    flexDirection: "row",
    alignItems: "center",
  },

  comment_interact_buttons_container: {
    flexDirection: "row"
  },

  comment_float_action_buttons_container: {
    position: "absolute",
    width: 120,
    right: 0,
    top: 22,
    zIndex: 2
  }
});

export default Comment