import {
  View,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

// Import components
import { FC } from "@/components";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { BlogManager } from "@/objects/blog";

// Import local state
import { StateManager } from "@/screens/blog-comments/state";

// Import styles
import { Styles } from "@/styles";

// Import types
import type { BlogComment } from "@/objects/blog/type";

export default function BlogCommentsScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const route = useRoute();
  const { id } = route.params as any;

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const handleCreateComment = function () {
    if (!state.commentContent) return;

    const newComment = {
      content: state.commentContent,
    };

    BlogManager.Api.postBlogComment(id, newComment).then((data) => {
      if (!data || !user) return;
      // Data will be
      // _id, blogId, userId, content, ...
      // So I have to transform it
      stateFns.addComment({
        _id: data._id,
        blog: { _id: data.blogId },
        user: {
          _id: data.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
        },
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });

      // Clear input
      stateFns.setCommentContent("");
    });
  };

  const getCommments = function () {
    let query = {
      blogId: id,
      skip: state.comments.length,
      limit: 20,
    };
    BlogManager.Api.getBlogComments(query).then((data) => {
      if (data === null || data.length === 0) return;

      stateFns.setComments(data);
    });
  };

  React.useEffect(() => {
    if (state.comments.length === 0) {
      getCommments();
    }
  }, [state.comments]);

  if (!user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      contentContainerStyle={[{ position: "relative" }]}
      style={[
        {
          flex: 1,
          backgroundColor: theme.background,
        },
      ]}
    >
      {/* FlatList */}
      <FlatList
        data={state.comments}
        style={[
          {
            backgroundColor: theme.background,
          },
        ]}
        contentContainerStyle={[
          {
            backgroundColor: theme.background,
          },
          Styles.spacings.ph_18,
          Styles.spacings.pt_18,
        ]}
        onMomentumScrollEnd={() => getCommments()}
        scrollEventThrottle={1000}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <FC.AppText style={{ textAlign: "center" }}>
            There aren't comments yet
          </FC.AppText>
        }
        renderItem={(item) => {
          const style = [];
          const data = item.item;

          if (item.index !== 0) {
            style.push(Styles.spacings.pt_12);
            style.push({ borderTopColor: theme.outline, borderTopWidth: 1 });
          }
          return (
            <FC.BlogComment
              key={data._id}
              comment={data}
              isOwnedByUser={data.user._id === user._id}
              onDelete={(commentId) => stateFns.removeComment(commentId)}
              style={style}
            />
          );
        }}
        keyExtractor={(item) => item._id as string}
        onRefresh={() => {
          stateFns.clearComments();
        }}
        refreshing={false}
      />
      {state.keyboardVisible && (
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
      )}
      <View
        style={[
          Styles.spacings.ph_18,
          {
            height: 60,
            flexDirection: "row",
            alignItems: "flex-end",
            width: "100%",
            // bottom: 0,
            backgroundColor: theme.background,
            borderTopColor: theme.outline,
            borderTopWidth: 1,
            // zIndex: 2,
          },
        ]}
      >
        <TextInput
          multiline
          onFocus={() => stateFns.setKeyBoardVisible(true)}
          onBlur={() => stateFns.setKeyBoardVisible(false)}
          value={state.commentContent}
          onChangeText={stateFns.setCommentContent}
          style={[
            Styles.spacings.pb_16,
            Styles.spacings.pt_16,
            { flex: 1, maxHeight: 120, color: theme.onBackground },
          ]}
          placeholder="Write your comment here..."
          placeholderTextColor={theme.outline}
        />
        <FC.CircleButton
          disabled={!Boolean(state.commentContent)}
          defaultColor="type_3"
          style={[Styles.spacings.ms_6, Styles.spacings.mb_6]}
          type="highlight"
          setIcon={(isActive, currentLabelStyle) => (
            <Feather name="send" size={16} style={currentLabelStyle} />
          )}
          onPress={handleCreateComment}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
