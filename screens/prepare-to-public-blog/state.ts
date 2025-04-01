// Import types
import type { ImagePickerAsset } from "expo-image-picker";
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type PrepareToPublishBlogScreenStateType = ReturnType<
  typeof getInitialState
>;

function getInitialState() {
  return {
    presentationImage: null as ImagePickerAsset | null,
    type: null as string | null,
    mentionedPlaces: [] as Array<any>,
    content: null as string | null,
    isShowSuggestTitle: false,
    isShowSuggestTitlePanel: false,
    indexSuggestTitle: null as number | null,
    titleArray: [] as Array<any>,
    isShowLoadingTitleArray: false,
    isPendingCallApi: false,
  };
}

function getStateFns(
  changeState: ChangeStateFn<PrepareToPublishBlogScreenStateType>
) {
  return {
    setPresentationImage(image: ImagePickerAsset | null) {
      changeState("presentationImage", function () {
        return image;
      });
    },

    setType(type: string | null) {
      changeState("type", function () {
        return type;
      });
    },

    setMentionedPlaces(places: any[]) {
      changeState("mentionedPlaces", function () {
        return places;
      });
    },

    addMentionedPlaces(place: any) {
      changeState("mentionedPlaces", function (data) {
        data.push(place);
        return data;
      });
    },

    removeMentionedPlaceById(id: string) {
      changeState("mentionedPlaces", function (data) {
        const index = data.findIndex((place) => place._id === id);
        return data.splice(index, 1);
      });
    },

    setContent(content: string | null) {
      changeState("content", function () {
        return content;
      });
    },

    setIsShowSuggestTitle(status: boolean) {
      changeState("isShowSuggestTitle", function () {
        return status;
      });
    },

    setIsShowSuggestTitlePanel(status: boolean) {
      changeState("isShowSuggestTitlePanel", function () {
        return status;
      });
    },

    setIndexSuggestTitle(index: number | null) {
      changeState("indexSuggestTitle", function () {
        return index;
      });
    },

    setTitleArray(titles: string[]) {
      changeState("titleArray", function () {
        return titles;
      });
    },

    setIsShowLoadingTitleArray(status: boolean) {
      changeState("isShowLoadingTitleArray", function () {
        return status;
      });
    },

    setIsPendingCallApi(status: boolean) {
      changeState("isPendingCallApi", function () {
        return status;
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
