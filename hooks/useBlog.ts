import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Import actions
import { blogsActions } from "@/states/redux/blogs";

// Import selectors
import { blogsSelectors } from "@/states/redux/blogs/selectors";

// Import types
import type { AppState, AppDispatch } from "@/states/redux/type";
import type { Blog } from "@/objects/blog/type";

export const { useBlogs, useBlogsActions, useBlogsState } = (function () {
  const createActions = function (dispatch: AppDispatch) {
    return {
      updateBriefBlog(id: string, briefBlog: Partial<Blog>) {
        dispatch(blogsActions.updateBriefBlog({ id, briefBlog }));
      },

      increaseSkipBriefBlogsAmount() {
        dispatch(blogsActions.increaseSkipBriefBlogsAmount());
      },

      decreaseSkipBriefBlogsAmount() {
        dispatch(blogsActions.decreaseSkipBriefBlogsAmount());
      },

      clearCurrentBlogs() {
        dispatch(blogsActions.clearCurrentBlogs());
      },
    };
  };

  const selectBlogs = function (_useSelector: typeof useSelector) {
    return _useSelector(blogsSelectors.selectCurrentBlogs);
  };

  const selectBlogDetails = function (
    _useSelector: typeof useSelector,
    id: string
  ) {
    return _useSelector((state: AppState) =>
      blogsSelectors.selectBlogDetails(state, id)
    );
  };

  return {
    /**
     * Use this hook to manage `blogs` and get actions to
     * manipulate `blogs`
     * @returns
     */
    useBlogs() {
      const dispatch = useDispatch();
      const blogsActions = createActions(dispatch);
      const blogs = selectBlogs(useSelector);

      return {
        blogs,
        blogsActions,
      };
    },

    /**
     * Use this hook to get only actions, it does not affect component's
     * life cycle when `blogs` is updated
     * @returns
     */
    useBlogsActions() {
      const dispatch = useDispatch();
      return createActions(dispatch);
    },

    /**
     * Use this hook to get only `blogs`
     * @returns
     */
    useBlogsState() {
      return selectBlogs(useSelector);
    },
  };
})();

export const { useBlogDetails, useBlogDetailsActions, useBlogDetailsState } =
  (function () {
    const createActions = function (dispatch: AppDispatch) {
      return {
        add(blogDetails: Blog) {
          dispatch(blogsActions.addBlogDetails(blogDetails));
        },

        update(blogDetails: Blog) {
          dispatch(
            blogsActions.updateBlogDetails({
              id: blogDetails._id,
              blogDetails,
            })
          );
        },

        remove(id: string) {
          dispatch(blogsActions.clearBlogDetails(id));
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
        const blogDispatchers = createActions(dispatch);
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
        return createActions(dispatch);
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
