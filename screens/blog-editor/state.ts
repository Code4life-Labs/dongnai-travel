// Import types
import type { ImagePickerAsset } from "expo-image-picker";
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type BlogEditorScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    content: "" as string | null,
    isContentFromStorage: false,
    isWebviewLoaded: false,
    images: [] as Array<ImagePickerAsset>,
  };
}

function getStateFns(changeState: ChangeStateFn<BlogEditorScreenStateType>) {
  return {
    setContent(content: string | null) {
      changeState("content", function () {
        return content;
      });
    },

    setIsContentFromStorage(status?: boolean) {
      changeState("isContentFromStorage", function () {
        return Boolean(status);
      });
    },

    setIsWebviewLoaded(status?: boolean) {
      changeState("isWebviewLoaded", function () {
        return Boolean(status);
      });
    },

    addImage(source: ImagePickerAsset) {
      changeState("images", function (data) {
        data.push(source);
        return data;
      });
    },

    removeImageAt(index: number) {
      changeState("images", function (data) {
        if (data.length === 0) return data;
        data.splice(index, 1);
        return data;
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
