// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";
import type { PlaceReview } from "@/objects/place/type";

export type PlaceReviewsScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    keyboardVisible: false,
    reviewRating: 0,
    reviewContent: "",
    reviews: [] as Array<PlaceReview>,
  };
}

function getStateFns(changeState: ChangeStateFn<PlaceReviewsScreenStateType>) {
  return {
    setKeyBoardVisible(status?: boolean) {
      changeState("keyboardVisible", function () {
        return Boolean(status);
      });
    },

    setReviewContent(content: string) {
      changeState("reviewContent", function () {
        return content;
      });
    },

    setReviewRating(rating: number) {
      changeState("reviewRating", function () {
        return rating;
      });
    },

    setReviews(reviews: Array<PlaceReview>) {
      changeState("reviews", function () {
        return reviews;
      });
    },

    addReview(review: PlaceReview) {
      changeState("reviews", function (data) {
        data.unshift(review);
        return data;
      });
    },

    removeReview(reviewId: string) {
      changeState("reviews", function (data) {
        const index = data.findIndex((review) => review._id === reviewId);

        if (index === -1) return data;

        data.splice(index, 1);

        return data;
      });
    },

    clearReviews() {
      changeState("reviews", function (data) {
        return [];
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
