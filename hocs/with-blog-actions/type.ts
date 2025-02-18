import type { ViewProps } from "react-native";
import type { Blog } from "@/objects/blog/type";

export type WithBlogActions_Actions = {
  navigate: () => void;
  toggleLike: () => void;
  share: () => void;
  saveInformation: (placeDetails: Blog) => void;
  updateInformation: (placeDetails: Blog) => void;
};

export type WithBlogActions_WrappedComponentProps = {
  actions: WithBlogActions_Actions;
} & ViewProps;
