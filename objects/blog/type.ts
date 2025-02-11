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
  avatar: string;
  type: string;
  isApproved: boolean;
  readTime: number;
  createdAt: number;
  updatedAt: number;
};

export type BaseBlog = {
  authorId: string;
  contentId: string;
  mentionedPlaces: Array<string>;
} & $Extendable;

export type Blog = {
  author: any;
  content: BlogContent;
  mentionedPlaces: Array<Place>;
  isLiked: boolean;
} & $Extendable;
