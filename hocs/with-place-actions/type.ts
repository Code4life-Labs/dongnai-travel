import type { ViewProps } from "react-native";

export type WrappedComponentProps = {
  extendedPlaceInfo: ExtendedPlaceInfoInPlaceCard;
  addPlaceDetails: (placeDetails: ContentDataProps) => {
    payload: ContentDataProps;
    type: string;
  };
  updateBriefPlace: (
    placeId: any,
    placeIndex: any,
    updateData: any
  ) => {
    payload: { placeId: any; placeIndex: any; updateData: any };
    type: string;
  };
  getTextContentInHTMLTag: (fullHtmlTag: string) => string[];
  handlePressImageButton: () => void;
  handleLikeButton: () => void;
} & ViewProps;
