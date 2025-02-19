import type { ViewProps } from "react-native";
import type { Place } from "@/objects/place/type";

export type WithPlaceActions_Actions = {
  navigate: () => void;
  like: () => void;
  visit: () => void;
  share: () => void;
  saveInformation: (placeDetails: Place) => void;
  updateInformation: (placeDetails: Place) => void;
};

export type WithPlaceActions_WrappedComponentProps = {
  getTextContentInHTMLTag: (fullHtmlTag: string) => string[];
  actions: WithPlaceActions_Actions;
} & ViewProps;
