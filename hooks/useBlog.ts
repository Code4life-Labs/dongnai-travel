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
  const createDispatchers = function (dispatch: AppDispatch) {
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
      const blogsDispatchers = createDispatchers(dispatch);
      const blogs = selectBlogs(useSelector);

      return {
        blogs,
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
      return selectBlogs(useSelector);
    },
  };
})();

export const { useBlogDetails, useBlogDetailsActions, useBlogDetailsState } =
  (function () {
    const createDispatchers = function (dispatch: AppDispatch) {
      return {
        addBlogDetails(blogDetails: Blog) {
          dispatch(blogsActions.addBlogDetails(blogDetails));
        },

        updateBlogDetails(blogDetails: Blog) {
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

/**
 * Hook này tạo ra các functions cho việc tương tác với Blog, còn ý tưởng như nào thì ae sang đọc file
 * `useBlog`, t cũng có để ở đó rồi.
 * @param {BlogDataProps} blog Dữ liệu của blog.
 * @returns
 * @example
 * ...
 * import { useBlogInteractionAPI } from 'customHooks/useBlog'
 *
 * function MyComponent({blog, blogIndex}) {
 *   // Ta có likeBlog là 1 interact action
 *   let { extendedBlogInfo, likeBlog } = useBlogInteractionAPI(blog);
 *
 *   let handleLikeButton = () => likeBlog(
 *     // Hàm này sẽ được gọi khi
 *     (data, state) => updateBlogDetail(blog.blog_id, blogIndex, { isLiked: state }),
 *     (state) => updateBlogDetail(blog.blog_id, blogIndex, { isLiked: state })
 *   )
 * }
 * ...
 */
export function useBlogInteractionActions(blog: Partial<Blog>) {
  const [extendedBlogInfo, setExtendedBlogInfo] = React.useState({
    isLiked: blog.isLiked ? true : false,
  });

  const createToggleInteractionActionsFunc = React.useCallback(
    /**
     * @param {"isLiked"} toggleInteraction
     * @param {string} updateCaseWhenActive
     * @param {string} updateCaseWhenInActive
     * @returns
     */
    (toggleInteraction, updateCaseWhenActive, updateCaseWhenInActive) => {
      /**
       * @param {(data: any, state: boolean) => {}} callWhenAPIResolve Callback gọi khi API resolve
       * @param {(state: boolean) => {}} callWhenAPIReject Callback gọi khi API reject
       */
      return function (callWhenAPIResolve, callWhenAPIReject) {
        setExtendedBlogInfo((prevState) => {
          let state = true;
          let updateCase = updateCaseWhenActive;
          if (prevState[toggleInteraction]) {
            state = false;
            updateCase = updateCaseWhenInActive;
          }
          let data = {
            updateCase: updateCase,
            updateData: blog._id,
          };
          updateUserByCaseAPI(data)
            .then((data) => {
              // Update lên store.
              if (callWhenAPIResolve) callWhenAPIResolve(data, state);
            })
            .catch((error) => {
              if (callWhenAPIReject) callWhenAPIReject(!state);
              setExtendedBlogInfo((prevState) => ({
                ...prevState,
                [toggleInteraction]: !state,
              }));
              console.error(error.message);
            });
          return { ...prevState, [toggleInteraction]: state };
        });
      };
    },
    []
  );

  /**
   * Hàm này dùng để yêu thích một blog, nó sẽ gửi id của blog về server và tự server nó sẽ xử lý.
   */
  const { likeBlog } = React.useMemo(
    () => ({
      /**
       * Hàm này dùng để yêu thích/bỏ yêu thích một địa điểm nào đó. Nhận vào hai tham số là
       * `callWhenAPIResolve` và `callWhenAPIReject`
       */
      likeBlog: createToggleInteractionActionsFunc(
        "isLiked",
        UPDATE_USER_CASES["addEle:savedBlogs"],
        UPDATE_USER_CASES["removeEle:savedBlogs"]
      ),
    }),
    []
  );

  React.useEffect(() => {
    // console.log("Isliked from blog: ", Boolean(blog.isLiked));
    if (Boolean(blog.isLiked) !== extendedBlogInfo.isLiked) {
      setExtendedBlogInfo((prevState) => ({
        ...prevState,
        isLiked: Boolean(blog.isLiked),
      }));
    }
  }, [blog.isLiked, blog.isVisited]);

  return {
    extendedBlogInfo,
    likeBlog,
  };
}
