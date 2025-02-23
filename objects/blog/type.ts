// Import types
import type { Place } from "../place/type";
import type { User } from "../user/type";
import type { ImagePickerAsset } from "expo-image-picker";

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
  content: string;
  isApproved: boolean;
  images: Array<string>;
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

export type UploadBlog = {
  images: Array<ImagePickerAsset>;
} & Omit<
  BlogModel,
  "_id" | "readTime" | "images" | "createdAt" | "updatedAt" | "isApproved"
>;

export type BlogCommentModel = {
  _id: string;
  userId: string;
  blogId: string;
  content: string;
  updatedAt: number;
  createdAt: number;
};

export type BlogComment = {
  _id: string;
  user: Partial<User>;
  blog: Partial<Blog>;
  content: string;
  updatedAt: number;
  createdAt: number;
};

export type CreateBlogComment = {
  content: string;
};
