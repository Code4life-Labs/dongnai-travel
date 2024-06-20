import { createSlice } from "@reduxjs/toolkit";

// Import utils
import { ArrayUtils } from "@/utils/array";
import { BooleanUtils } from "@/utils/boolean";
import { NumberUtils } from "@/utils/number";

// Import types
import type { Blog } from "@/objects/blog/type";

import { blogsThunks } from "./middlewares";

/**
 * Use to create a brieft blog object to manage current blogs
 * @param limit
 * @param skip
 * @returns
 */
function _createDefaultBriefBlog(limit = 5, skip = 0) {
  return {
    type: "",
    limit: limit,
    skip: skip,
    data: [] as Array<Partial<Blog>>,
  };
}

export const blogsSlice = createSlice({
  name: "blogs",
  initialState: {
    detailsOfBlogs: new Map<string, Partial<Blog>>(),
    currentBlogs: _createDefaultBriefBlog(),
  },
  reducers: {
    /**
     * Use to add a blogs details to Map (for caching)
     * @param state
     * @param action
     */
    addBlogDetails(state, action) {
      const blogDetails = action.payload as Blog;
      if (!state.detailsOfBlogs.get(blogDetails._id))
        state.detailsOfBlogs.set(blogDetails._id, blogDetails);
    },

    /**
     * Use to update an existing blog's details with `id`
     * @param state
     * @param action
     */
    updateBlogDetails(state, action) {
      const { id, blogDetails } = action.payload as {
        id: string;
        blogDetails: Blog;
      };

      state.detailsOfBlogs.set(id, blogDetails);
    },

    /**
     * Use to clear a blog details by id
     * @param state
     * @param action
     */
    clearBlogDetails(state, action) {
      let blogId = action.payload;
      if (state.detailsOfBlogs.get(blogId)) state.detailsOfBlogs.delete(blogId);
    },

    /**
     * Use to update a brief blog (for caching)
     * @param state
     * @param action
     */
    updateBriefBlog(state, action) {
      let { blogIndex, updateData } = action.payload;
      if (BooleanUtils.isEmpty(blogIndex)) return;

      let blog = state.currentBlogs.data![blogIndex];
      if (blog) {
        state.currentBlogs.data = ArrayUtils.updateAt(
          state.currentBlogs.data!,
          blogIndex,
          Object.assign(blog, updateData)
        );
      }
    },

    /**
     * Use to update amount of skip
     * @param state
     * @param action
     */
    increaseSkipBriefBlogsAmount(state) {
      state.currentBlogs.skip += state.currentBlogs.skip;
    },

    /**
     * Use to decrease amount of skip, prevent the value lower than 0
     * @param state
     * @param action
     */
    decreaseSkipBriefBlogsAmount(state) {
      state.currentBlogs.skip = NumberUtils.decreaseByAmount(
        state.currentBlogs.skip,
        state.currentBlogs.limit
      );
    },

    /**
     * Use to refresh current blogs
     * @param state
     * @param action
     */
    clearCurrentBlogs(state) {
      state.currentBlogs = _createDefaultBriefBlog();
    },
  },
  extraReducers(builder) {
    builder.addCase(
      blogsThunks.getBlogsByTypeAsync.fulfilled,
      (state, action) => {
        let [typeOfBlog, blogs] = action.payload;

        if (blogs.length !== 0) {
          state.currentBlogs.type = typeOfBlog;
          state.currentBlogs.data = state.currentBlogs.data.concat(blogs);
          state.currentBlogs.skip += blogs.length;
        }
      }
    );

    builder.addCase(
      blogsThunks.getBlogDetailsByIdAsync.fulfilled,
      (state, action) => {
        let [blogId, blogDetails] = action.payload;

        state.detailsOfBlogs.set(blogId, blogDetails);
      }
    );
  },
});

export const blogsActions = blogsSlice.actions;
