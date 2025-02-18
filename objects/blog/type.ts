// Import types
import { Place } from "../place/type";

export type BlogType = {
  _id: string;
  name: string;
  value: string;
  createdAt: number;
  updatedAt: number;
};

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
  totalFavorites?: number;
  totalComments?: number;
  content?: string;
  plainContent?: string;
} & $Extendable;
