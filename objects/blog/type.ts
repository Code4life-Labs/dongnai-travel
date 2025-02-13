// Import types
import { Place } from "../place/type";

type BlogContent = {
  _id: string;
  plainText: {
    vi: string;
    en: string;
  };
  formattedText: {
    vi: string;
    en: string;
  };
  speech?: {
    female: string;
    male: string;
  };
  createdAt: number;
  updatedAt: number;
};

export type $Extendable = {
  _id: string;
  name: string;
  coverImage: string;
  contentUrl: string;
  isApproved: boolean;
  readTime: number;
  createdAt: number;
  updatedAt: number;
};

export type BlogModel = {
  authorId: string;
  typeId: string;
  mentionedPlaces: Array<string>;
} & $Extendable;

export type Blog = {
  author: any;
  type: any;
  mentionedPlaces: Array<Partial<Place>>;
  isLiked?: boolean;
  userFavoritesTotal?: number;
  userCommentsTotal?: number;
  content?: string;
  plainContent?: string;
} & $Extendable;
