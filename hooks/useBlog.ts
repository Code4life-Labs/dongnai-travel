import { useSelector, useDispatch } from "react-redux";

// Import actions
import { blogsActions } from "@/states/redux/blogs";

// Import selectors
import { blogsSelectors } from "@/states/redux/blogs/selectors";

// Import types
import type { AppState, AppDispatch } from "@/states/redux/type";
import type { Blog } from "@/objects/blog/type";

export const { useBlogs, useBlogsActions, useBlogsState, useBlogDetailsState } =
  (function () {
    const createDispatchers = function (dispatch: AppDispatch) {
      return {
        addBlogDetails(placeDetails: Blog) {
          dispatch(blogsActions.addBlogDetails(placeDetails));
        },

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

        clearBlogDetails(id: string) {
          dispatch(blogsActions.clearBlogDetails(id));
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
      useBlogs() {
        const dispatch = useDispatch();
        const blogsDispatchers = createDispatchers(dispatch);
        const blogs = selectBlogs(useSelector);

        return {
          blogs,
          blogsDispatchers,
        };
      },

      useBlogsActions() {
        const dispatch = useDispatch();
        return createDispatchers(dispatch);
      },

      useBlogsState() {
        return selectBlogs(useSelector);
      },

      useBlogDetailsState(id: string) {
        return selectBlogDetails(useSelector, id);
      },
    };
  })();
