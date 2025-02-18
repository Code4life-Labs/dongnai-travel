import { createAsyncThunk } from "@reduxjs/toolkit";

// Import objects
import { BlogManager } from "@/objects/blog";

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
      const data = await BlogManager.Api.getPlaceTypes();
      return data;
    } catch (error: any) {
      console.error(error.message);
      return null;
    }
  }
);

export const blogsThunks = {
  getBlogsAsync,
  getBlogDetailAsync,
  getBlogTypesAsync,
};
