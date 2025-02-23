// Import types
import type { ImagePickerAsset } from "expo-image-picker";
import type { ChangeStateFn } from "@/hooks/useStateManager";
import type { BlogComment } from "@/objects/blog/type";

export type BlogCommentsScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    keyboardVisible: false,
    commentContent: "",
    comments: [] as Array<BlogComment>,
  };
}

function getStateFns(changeState: ChangeStateFn<BlogCommentsScreenStateType>) {
  return {
    setKeyBoardVisible(status?: boolean) {
      changeState("keyboardVisible", function () {
        return Boolean(status);
      });
    },

    setCommentContent(content: string) {
      changeState("commentContent", function () {
        return content;
      });
    },

    setComments(comments: Array<BlogComment>) {
      changeState("comments", function () {
        return comments;
      });
    },

    addComment(comment: BlogComment) {
      changeState("comments", function (data) {
        data.unshift(comment);
        return data;
      });
    },

    removeComment(commentId: string) {
      changeState("comments", function (data) {
        const index = data.findIndex((comment) => comment._id === commentId);

        if (index === -1) return data;

        data.splice(index, 1);

        return data;
      });
    },

    clearComments() {
      changeState("comments", function (data) {
        return [];
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
