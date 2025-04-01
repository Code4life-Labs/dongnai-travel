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
import { Redirect, router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

// Import components
import { FC } from "@/components";
import SetRating from "@/screens/place-reviews/components/set-rating";

// Import hooks
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useStateManager } from "@/hooks/useStateManager";

// Import objects
import { PlaceManager } from "@/objects/place";

// Import local state
import { StateManager } from "@/screens/place-reviews/state";

// Import styles
import { Styles } from "@/styles";

// Import types
import type { PlaceReview } from "@/objects/place/type";

export default function PlaceReviewsScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const route = useRoute();
  const { id } = route.params as any;

  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const handleCreateReview = function () {
    if (!state.reviewContent || !state.reviewRating) return;

    const newReview = {
      content: state.reviewContent,
      rating: state.reviewRating,
    };

    PlaceManager.Api.postPlaceReview(id, newReview).then((data) => {
      if (!data || !user) return;
      // Data will be
      // _id, blogId, userId, content, ...
      // So I have to transform it
      stateFns.addReview({
        _id: data._id,
        place: { _id: data.placeId },
        user: {
          _id: data.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
        },
        content: data.content,
        rating: data.rating,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });

      // Clear input
      stateFns.setReviewContent("");
      stateFns.setReviewRating(0);
    });
  };

  const getReviews = function () {
    let query = {
      placeId: id,
      skip: state.reviews.length,
      limit: 20,
    };
    PlaceManager.Api.getPlaceReviews(query).then((data) => {
      if (data === null || data.length === 0) return;

      stateFns.setReviews(data);
    });
  };

  React.useEffect(() => {
    if (state.reviews.length === 0) {
      getReviews();
    }
  }, [state.reviews]);

  React.useEffect(() => {
    if (!user) {
      router.back();
    }
  }, []);

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
        data={state.reviews}
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
        onMomentumScrollEnd={() => getReviews()}
        scrollEventThrottle={1000}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <FC.AppText style={{ textAlign: "center" }}>
            There aren't reviews yet
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
            <FC.PlaceReview
              key={data._id}
              review={data}
              isOwnedByUser={data.user._id === user!._id}
              onDelete={(reviewId) => stateFns.removeReview(reviewId)}
              style={style}
            />
          );
        }}
        keyExtractor={(item) => item._id as string}
        onRefresh={() => {
          stateFns.clearReviews();
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
          Styles.spacings.pv_18,
          { flexDirection: "row", alignItems: "center" },
        ]}
      >
        <FC.AppText style={Styles.spacings.me_6}>Your ratings:</FC.AppText>
        <SetRating
          rating={state.reviewRating}
          setRating={stateFns.setReviewRating}
        />
      </View>
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
          value={state.reviewContent}
          onChangeText={stateFns.setReviewContent}
          style={[
            Styles.spacings.pb_16,
            Styles.spacings.pt_16,
            { flex: 1, maxHeight: 120, color: theme.onBackground },
          ]}
          placeholder="Write your review here..."
          placeholderTextColor={theme.outline}
        />
        <FC.CircleButton
          disabled={!Boolean(state.reviewContent)}
          defaultColor="type_3"
          style={[Styles.spacings.ms_6, Styles.spacings.mb_6]}
          type="highlight"
          setIcon={(isActive, currentLabelStyle) => (
            <Feather name="send" size={16} style={currentLabelStyle} />
          )}
          onPress={handleCreateReview}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
