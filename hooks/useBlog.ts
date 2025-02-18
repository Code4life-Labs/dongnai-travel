import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Import redux actions
import { blogsActions } from "@/states/redux/blogs";

// Import redux middlewares
import { blogsThunks } from "@/states/redux/blogs/middlewares";

// Import selectors
import { blogsSelectors } from "@/states/redux/blogs/selectors";

// Import types
import type { AppState, AppDispatch } from "@/states/redux/type";
import type { Blog } from "@/objects/blog/type";

export const { useBlogs, useBlogsActions, useBlogsState } = (function () {
  const createDispatchers = function (dispatch: AppDispatch) {
    return {
      fetchBlogs(type: string = "all") {
        dispatch(blogsThunks.getBlogsAsync(type));
      },

      fetchBlogTypes() {
        dispatch(blogsThunks.getBlogTypesAsync());
      },

      likeBlog(placeId: string) {
        dispatch(blogsThunks.likeBlogAsync(placeId));
      },

      unlikeBlog(placeId: string) {
        dispatch(blogsThunks.unlikeBlogAsync(placeId));
      },

      updateBriefBlog(id: string, briefBlog: Partial<Blog>) {
        dispatch(blogsActions.updateBriefBlog({ id, briefBlog }));
      },

      increaseSkipAmount() {
        dispatch(blogsActions.increaseSkipInBriefBlogListInformation());
      },

      decreaseSkipAmount() {
        dispatch(blogsActions.decreaseSkipInBriefBlogListInformation());
      },

      clear() {
        dispatch(blogsActions.clearBriefBlogInformation());
      },
    };
  };

  const selectBlogs = function (_useSelector: typeof useSelector) {
    return _useSelector(blogsSelectors.selectCurrentBlogs);
  };

  const selectBlogTypes = function (_useSelector: typeof useSelector) {
    return _useSelector(blogsSelectors.selectBlogTypes);
  };

  return {
    /**
     * Use this hook to manage `blogs` and get actions to
     * manipulate `blogs`
     * @returns
     */
    useBlogs() {
      const dispatch = useDispatch();
      const blogsDispatchers = createDispatchers(dispatch);
      const blogs = selectBlogs(useSelector);
      const blogTypes = selectBlogTypes(useSelector);

      return {
        blogs,
        blogTypes,
        blogsDispatchers,
      };
    },

    /**
     * Use this hook to get only actions, it does not affect component's
     * life cycle when `blogs` is updated
     * @returns
     */
    useBlogsActions() {
      const dispatch = useDispatch();
      return createDispatchers(dispatch);
    },

    /**
     * Use this hook to get only `blogs`
     * @returns
     */
    useBlogsState() {
      return {
        blogs: selectBlogs(useSelector),
        blogTypes: selectBlogTypes(useSelector),
      };
    },
  };
})();

export const { useBlogDetails, useBlogDetailsActions, useBlogDetailsState } =
  (function () {
    const createDispatchers = function (dispatch: AppDispatch) {
      return {
        fetchBlogDetail(id: string) {
          dispatch(blogsThunks.getBlogDetailAsync(id));
        },

        likeBlog(placeId: string) {
          dispatch(blogsThunks.likeBlogAsync(placeId));
        },

        unlikeBlog(placeId: string) {
          dispatch(blogsThunks.unlikeBlogAsync(placeId));
        },

        add(blogDetails: Blog) {
          dispatch(blogsActions.addBlog(blogDetails));
        },

        update(blogDetails: Blog) {
          dispatch(
            blogsActions.updateBlog({
              id: blogDetails._id,
              blogDetails,
            })
          );
        },

        remove(id: string) {
          dispatch(blogsActions.clearBlog(id));
        },
      };
    };

    const select = function (_useSelector: typeof useSelector, id: string) {
      return _useSelector((state: AppState) =>
        blogsSelectors.selectBlogDetails(state, id)
      );
    };

    return {
      /**
       * Use this hook to manage `blog's details` and get actions to
       * manipulate `blog's details`
       * @returns
       */
      useBlogDetails(id: string) {
        const dispatch = useDispatch();
        const blogDispatchers = createDispatchers(dispatch);
        const blog = select(useSelector, id);

        return {
          blog,
          blogDispatchers,
        };
      },

      /**
       * Use this hook to get only actions, it does not affect component's
       * life cycle when `blog's details` is updated
       * @returns
       */
      useBlogDetailsActions() {
        const dispatch = useDispatch();
        return createDispatchers(dispatch);
      },

      /**
       * Use this hook to get only `blog's details`
       * @returns
       */
      useBlogDetailsState(id: string) {
        return select(useSelector, id);
      },
    };
  })();
