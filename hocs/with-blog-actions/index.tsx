import React from "react";
import { debounce } from "lodash";
import { router } from "expo-router";

// Import hooks
import { useBlogDetailsActions } from "@/hooks/useBlog";

// Import from utils
import { StringUtils } from "@/utils/string";

// Import types
import type {
  WithBlogActions_WrappedComponentProps,
  WithBlogActions_Actions,
} from "./type";
import type { Blog } from "@/objects/blog/type";

/**
 * @typedef BlogCardProps
 * @property {BlogDataProps} blog Thông tin về một địa điểm của một nơi nào đó.
 * @property {string} typeOfBriefBlog Type của brief blogs.
 * @property {number} blogIndex Index của blog trong data của briefBlog. Cái này dùng để tìm blog cho nhanh, khỏi dùng vòng lặp.
 */

/**
 * #### HOC
 *
 * Đây là một Higher order component, chứa các logic cơ bản của một Blog Card bao gồm:
 * - Yêu thích một địa điểm
 * - Đã ghé thăm một địa điểm
 * @param {(props: WithBlogCardWrappedComponentProps) => JSX.Element} Component Component này sẽ dùng các logic trong `withBlogCard`.
 * @example
 * ...
 * import { withBlogCard } from 'hocs/withBlogCard'
 *
 * function HorizontalBlogCard({...}) {...}
 *
 * export default withBlogCard(HorizontalBlogCard)
 *
 * // OR
 * import { withBlogCard } from 'hocs/withBlogCard'
 *
 * function VerticalBlogCard({...}) {...}
 *
 * export default withBlogCard(VerticalBlogCard)
 * ...
 */
export function withBlogActions<T extends object>(
  WrappedComponent: (
    props: T & WithBlogActions_WrappedComponentProps
  ) => JSX.Element
) {
  const _toggleLike = debounce(function (
    blog: any,
    likePlace: any,
    unlikePlace: any
  ) {
    if (blog.isLiked) {
      likePlace(blog._id);
    } else {
      unlikePlace(blog._id);
    }
  }, 100);

  /**
   * Component này sẽ nhận một component khác và bọc nó lại, đồng thời function này sẽ truyền logic lại cho
   * component được bọc đó (WrappedComponent).
   * @param {ViewProps & BlogCardProps} props Props của component.
   */
  return function (props: T) {
    const { data } = props as any;

    const blogDetailsActions = useBlogDetailsActions();

    const actions: WithBlogActions_Actions = {
      /**
       * Dùng để mở blog
       */
      navigate() {
        blogDetailsActions.add(data);
        router.push("/blogs");
      },
      toggleLike() {
        _toggleLike(
          data,
          blogDetailsActions.likeBlog,
          blogDetailsActions.unlikeBlog
        );
      },

      share() {
        const title = "DongNaiTravelApp";
        const url = data.cover;
        const message = `Hãy cùng đọc blog ${data.title} với mình nhé!`;
      },

      saveInformation(placeDetails: Blog) {
        blogDetailsActions.add(placeDetails);
      },

      updateInformation(placeDetails: Blog) {
        blogDetailsActions.update(placeDetails);
      },
    };

    return <WrappedComponent {...props} actions={actions} />;
  };
}
