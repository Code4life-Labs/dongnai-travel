import { createAsyncThunk } from "@reduxjs/toolkit";

// Import types
import type { AppState } from "../type";
import type { Blog } from "@/objects/blog/type";

// import { getBlogsAPI, getBlogDetailsWithPipelineAPI } from "apis/axios";

const getBlogsByTypeAsync = createAsyncThunk(
  "blogs/getBlogsByTypeAsync",
  async (payload: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState,
        type = payload,
        blogs = state.blogs.currentBlogs,
        limit = blogs ? blogs.limit : 5,
        skip = blogs ? blogs.skip : 0,
        query = `limit=${limit}&skip=${skip}&filter=quality:${type}`;
      const data = await getBlogsAPI(query);
      return [type, data];
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const getBlogDetailsByIdAsync = createAsyncThunk(
  "blogs/getBlogDetailsByIdAsync",
  async (payload: { blogId: string; lang: string }, thunkAPI) => {
    try {
      const { blogId, lang } = payload,
        query = `blogId=${blogId}&lang=${lang}`;
      const data = await getBlogDetailsWithPipelineAPI(query);
      return [blogId, data];
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

export const blogsThunks = {
  getBlogsByTypeAsync,
  getBlogDetailsByIdAsync,
};
