import {
  View,
  Image,
  StyleSheet,
  ActionSheetIOS,
  ViewStyle,
  Alert,
  Animated,
  Pressable,
} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import components
import AppText from "../app_text";
import RectangleButton from "../buttons/RectangleButton";

// Import hooks
import { useTheme } from "@/hooks/useTheme";

// Import objects
import { BlogManager } from "@/objects/blog";

// Import utils
import { DatetimeUtils } from "@/utils/datetime";

// Import styles
import { styles } from "./styles";
import { Styles } from "@/styles";

// Import types
import type { BlogComment } from "@/objects/blog/type";
import type { ViewProps } from "react-native";

type CommentProps = {
  comment: BlogComment;
  isOwnedByUser: boolean;
  onDelete(commentId: string): void;
} & ViewProps;

/**
 * Component này dùng để hiển thị ra comment của người dùng. Nó sẽ nhận một object như sau
 * @param {ViewProps & CommentProps} props
 * @returns
 */
export default function BlogComment({
  comment,
  isOwnedByUser,
  onDelete,
  ...props
}: CommentProps) {
  const { theme } = useTheme();

  const [commentInfo, setCommentInfo] = React.useState({
    isActionsVisible: false,
  });
  const floatActionsScaleAnim = React.useRef(new Animated.Value(0)).current;

  const handleToggleFloatActionsPress = React.useCallback(
    (function () {
      let actionsVisible = false;
      return function () {
        Animated.spring(floatActionsScaleAnim, {
          toValue: actionsVisible ? 0 : 1,
          useNativeDriver: true,
        }).start();
        actionsVisible = !actionsVisible;
        setCommentInfo((prevState) => ({
          ...prevState,
          isActionsVisible: actionsVisible,
        }));
      };
    })(),
    []
  );

  const authorName =
    comment.user.lastName && comment.user.firstName
      ? `${comment.user.lastName} ${comment.user.firstName}`
      : comment.user.displayName;
  const { type, distance } = DatetimeUtils.getTimeDistance(comment.createdAt);

  return (
    <View {...props} style={[Styles.spacings.pb_12, props.style]}>
      {commentInfo.isActionsVisible && (
        <Pressable
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
          onPress={handleToggleFloatActionsPress}
        />
      )}
      {/* Information and Actions Container */}
      <View style={styles.comment_info_n_actions_container}>
        {/* Basic user info container */}
        <View style={styles.comment_author_info_container}>
          <View style={Styles.spacings.me_12}>
            {comment.user.avatar ? (
              <Image
                style={{ width: 42, aspectRatio: 1, borderRadius: 9999 }}
                source={{ uri: comment.user.avatar }}
              />
            ) : (
              <Ionicons
                style={{ margin: -6 }}
                color={theme.onBackground}
                size={48}
                name="person-circle-outline"
              />
            )}
          </View>
          <View>
            <AppText size="h4">{authorName}</AppText>
            <AppText size="sub1">
              {distance} {type} ago
            </AppText>
          </View>
        </View>

        <View style={{ position: "relative", zIndex: 2 }}>
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
              Styles.boxShadows.type_1,
              Styles.shapes.rounded_12,
              {
                backgroundColor: theme.background,
                transform: [
                  {
                    scale: floatActionsScaleAnim,
                  },
                ],
              },
            ]}
          >
            {isOwnedByUser ? (
              <>
                <RectangleButton
                  defaultColor="type_4"
                  type="opacity"
                  onPress={() => {
                    Alert.alert("Tính năng này đang được phát triển!");
                  }}
                >
                  Edit
                </RectangleButton>
                <RectangleButton
                  defaultColor="type_4"
                  type="opacity"
                  onPress={() =>
                    BlogManager.Api.deleteBlogComment(comment.blog._id!).then(
                      (data) => {
                        if (!data) return;
                        onDelete(comment._id);
                      }
                    )
                  }
                >
                  {(isActive, currentLabelStyle) => (
                    <AppText style={[currentLabelStyle, { color: "red" }]}>
                      Delete
                    </AppText>
                  )}
                </RectangleButton>
              </>
            ) : (
              <RectangleButton
                defaultColor="type_4"
                type="opacity"
                onPress={() => {
                  Alert.alert("Tính năng này đang được phát triển!");
                }}
              >
                {(isActive, currentLabelStyle) => (
                  <AppText style={[currentLabelStyle, { color: "red" }]}>
                    Report
                  </AppText>
                )}
              </RectangleButton>
            )}
          </Animated.View>
        </View>
      </View>

      {/* Text */}
      <AppText
        style={[Styles.spacings.mv_12, { position: "relative", zIndex: 1 }]}
      >
        {comment.content}
      </AppText>

      <View style={[styles.comment_interact_buttons_container]}>
        {/* <CircleButton
          type="highlight"
          setIcon={(isActive, currentLabelStyle) => (
            <Ionicons name='heart-outline' size={14} style={currentLabelStyle} />
          )}
        /> */}
      </View>
    </View>
  );
}
