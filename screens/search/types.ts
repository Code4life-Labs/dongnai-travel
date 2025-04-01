// Import types
import type { Place } from "@/objects/place/type";
import type { Blog } from "@/objects/blog/type";
import type { User } from "@/objects/user/type";

export type SearchResult = Place | Blog | User;

export type SearchScreenProps = {
  navigation: {
    goBack: () => void;
    push: (screen: string, params: any) => void;
  };
  theme: {
    background: string;
    onBackground: string;
    outline?: string;
  };
};

export type PlaceSearchResponse = {
  place_id: string;
  name: string;
  _dataType: string;
  [key: string]: any;
};
