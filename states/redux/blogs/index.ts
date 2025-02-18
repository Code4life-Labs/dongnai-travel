import { createSlice } from "@reduxjs/toolkit";

// Import utils
import { ArrayUtils } from "@/utils/array";
import { BooleanUtils } from "@/utils/boolean";
import { NumberUtils } from "@/utils/number";

// Import types
import type { Blog, BlogType } from "@/objects/blog/type";

import { blogsThunks } from "./middlewares";

type InitialState = {
  types: Array<BlogType>;
  blogDict: Record<string, Blog>;
  briefBlogListInformation: {
    type: string;
    limit: number;
    skip: number;
    data: Array<Partial<Blog>>;
  };
};

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

const _DefaultTypes = [
  {
    value: "all",
    name: "All",
  },
] as Array<BlogType>;

const initialState: InitialState = {
  types: [],
  blogDict: Object(),
  briefBlogListInformation: _createDefaultBriefBlog(),
};

export const blogsSlice = createSlice({
  name: "blogs",
  initialState: { ...initialState },
  reducers: {
    /**
     * Use to add a blogs details to Map (for caching)
     * @param state
     * @param action
     */
    addBlog(state, action) {
      const blog = action.payload as Blog;
      if (!state.blogDict[blog._id]) state.blogDict[blog._id] = blog;
    },

    /**
     * Use to update an existing blog's details with `id`
     * @param state
     * @param action
     */
    updateBlog(state, action) {
      const { id, blog } = action.payload as {
        id: string;
        blog: Blog;
      };

      state.blogDict[id] = blog;
    },

    /**
     * Use to clear a blog details by id
     * @param state
     * @param action
     */
    clearBlog(state, action) {
      let blogId = action.payload;
      if (state.blogDict[blogId]) delete state.blogDict[blogId];
    },

    /**
     * Use to update a brief blog (for caching)
     * @param state
     * @param action
     */
    updateBriefBlog(state, action) {
      let { blogIndex, updateData } = action.payload;
      if (BooleanUtils.isEmpty(blogIndex)) return;

      let blog = state.briefBlogListInformation.data![blogIndex];
      if (blog) {
        state.briefBlogListInformation.data = ArrayUtils.updateAt(
          state.briefBlogListInformation.data!,
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
    increaseSkipInBriefBlogListInformation(state) {
      state.briefBlogListInformation.skip +=
        state.briefBlogListInformation.skip;
    },

    /**
     * Use to decrease amount of skip, prevent the value lower than 0
     * @param state
     * @param action
     */
    decreaseSkipInBriefBlogListInformation(state) {
      state.briefBlogListInformation.skip = NumberUtils.decreaseByAmount(
        state.briefBlogListInformation.skip,
        state.briefBlogListInformation.limit
      );
    },

    /**
     * Use to refresh current blogs
     * @param state
     * @param action
     */
    clearBriefBlogInformation(state) {
      state.briefBlogListInformation = _createDefaultBriefBlog();
    },
  },
  extraReducers(builder) {
    builder.addCase(blogsThunks.getBlogsAsync.fulfilled, (state, action) => {
      if (!action.payload) return;

      let [typeOfBlog, blogs] = action.payload;

      if (blogs.length !== 0) {
        state.briefBlogListInformation.type = typeOfBlog;
        state.briefBlogListInformation.data =
          state.briefBlogListInformation.data.concat(blogs);
        state.briefBlogListInformation.skip += blogs.length;
      }
    });

    builder.addCase(
      blogsThunks.getBlogDetailAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        let [blogId, blog] = action.payload;

        console.log("BlogID:", blogId);
        console.log("Blog Metadata:", blog);

        state.blogDict[blogId] = blog;
      }
    );

    builder.addCase(
      blogsThunks.getBlogTypesAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        state.types = state.types.concat(_DefaultTypes, action.payload);
      }
    );
  },
});

export const blogsActions = blogsSlice.actions;
