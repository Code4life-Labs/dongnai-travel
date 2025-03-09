import { createAsyncThunk } from "@reduxjs/toolkit";

// Import objects
import { BlogManager } from "@/objects/blog";
import { UserManager } from "@/objects/user";

// Import types
import type { AppState } from "../type";
import type { Blog } from "@/objects/blog/type";
import { API } from "@/classes/API";

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

      const data = await BlogManager.Api.getBlogsAsync({
        limit,
        skip,
        type,
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

      const data = await BlogManager.Api.getBlogAsync({ id: payload });

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
  async (placeId: string) => {
    try {
      await BlogManager.Api.postLikedBlogAsync(placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const unlikeBlogAsync = createAsyncThunk(
  "places/unlikeBlogAsync",
  async (placeId: string) => {
    try {
      await BlogManager.Api.deleteLikedBlogAsync(placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const uploadBlogAsync = createAsyncThunk(
  "places/uploadBlogAsync",
  async (value: any) => {
    try {
      const { metadata, completeBlog } = value;

      // Validate metadata before uploading
      await BlogManager.Api.validateBlogMetadata(metadata);

      // Upload blog
      const result = await BlogManager.Api.postBlog(completeBlog);
      return result;
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
  uploadBlogAsync,
};
