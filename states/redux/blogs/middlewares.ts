import { createAsyncThunk } from "@reduxjs/toolkit";

// Import objects
import { BlogManager } from "@/objects/blog";
import { UserManager } from "@/objects/user";

// Import types
import type { AppState } from "../type";
import type { Blog } from "@/objects/blog/type";

// import { getBlogsAPI, getBlogDetailsWithPipelineAPI } from "apis/axios";

const getBlogsAsync = createAsyncThunk(
  "blogs/getBlogsAsync",
  async (payload: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState,
        type = payload,
        blogs = state.blogs.briefBlogListInformation,
        limit = blogs ? blogs.limit : 5,
        skip = blogs ? blogs.skip : 0;
      const userId = state.user.user?._id;

      const data = await BlogManager.Api.getBlogsAsync({
        limit,
        skip,
        type,
        userId,
      });
      return [type, data] as [string, Array<Blog>];
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }
);

const getBlogDetailAsync = createAsyncThunk(
  "blogs/getBlogDetailAsync",
  async (payload: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userId = state.user.user?._id;

      const data = await BlogManager.Api.getBlogAsync({ id: payload, userId });

      return [payload, data] as [string, Blog];
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }
);

const getBlogTypesAsync = createAsyncThunk(
  "blogs/getBlogTypesAsync",
  async () => {
    try {
      const data = await BlogManager.Api.getBlogTypes();
      return data;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }
);

const likeBlogAsync = createAsyncThunk(
  "places/likeBlogAsync",
  async (placeId: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;

      await BlogManager.Api.postLikedBlogAsync(userId, placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const unlikeBlogAsync = createAsyncThunk(
  "places/unlikeBlogAsync",
  async (placeId: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;

      await BlogManager.Api.deleteLikedBlogAsync(userId, placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

export const blogsThunks = {
  getBlogsAsync,
  getBlogDetailAsync,
  getBlogTypesAsync,
  likeBlogAsync,
  unlikeBlogAsync,
};
