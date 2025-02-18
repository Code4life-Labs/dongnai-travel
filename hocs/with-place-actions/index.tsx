import React from "react";
import { debounce } from "lodash";
import { router } from "expo-router";

// Import from hooks
import { usePlaceDetailsActions } from "@/hooks/usePlace";

// Import from utils
import { StringUtils } from "@/utils/string";

// Import types
import type {
  WithPlaceActions_WrappedComponentProps,
  WithPlaceActions_Actions,
} from "./type";
import type { Place } from "@/objects/place/type";

/**
 * Dùng để tạo ra một component có các hàm xử lý logic như là:
 * - Yêu thích một địa điểm
 * - Đã ghé thăm một địa điểm
 * @param Component Component này sẽ dùng các logic trong `withPlaceCard`.
 * @example
 * ...
 * import { withPlaceActions } from 'hocs/with-place-actions'
 *
 * function HorizontalPlaceCard({...}) {...}
 *
 * export default withPlaceActions(HorizontalPlaceCard)
 *
 * // OR
 * import { withPlaceActions } from 'hocs/with-place-actions'
 *
 * function VerticalPlaceCard({...}) {...}
 *
 * export default withPlaceActions(VerticalPlaceCard)
 * ...
 */
export function withPlaceActions<T extends object>(
  WrappedComponent: (
    props: T & WithPlaceActions_WrappedComponentProps
  ) => JSX.Element
) {
  /**
   * Hàm này dùng để lấy text content trong `adr_address`. Mặc định là 2 thẻ
   * `<span class"locality"></span>` và `<span class"region"></span>`. Nếu như có gì
   * thay đổi thì vào trong HOC này để sửa đổi.
   */
  const getTextContentInHTMLTag = StringUtils.createTextContentInHTMLTagGetter(
    '<span class="(locality|region)">',
    "</span>"
  );

  const toggleFavorite = debounce(function (
    place: any,
    favoritePlace: any,
    unfavoritePlace: any
  ) {
    if (place.isLiked) {
      favoritePlace(place._id);
    } else {
      unfavoritePlace(place._id);
    }
  }, 100);
  const toggleVisit = debounce(function (
    place: any,
    visitPlace: any,
    unvisitPlace: any
  ) {
    if (place.isVisited) {
      visitPlace(place._id);
    } else {
      unvisitPlace(place._id);
    }
  }, 100);

  /**
   * Component này sẽ nhận một component khác và bọc nó lại, đồng thời function này sẽ truyền logic lại cho
   * component được bọc đó (WrappedComponent).
   * @param props Props của component.
   */
  return function (props: T) {
    const { data } = props as any;

    const placeDetailsActions = usePlaceDetailsActions();

    const actions: WithPlaceActions_Actions = {
      navigate() {
        placeDetailsActions.add(data);
        router.navigate({
          pathname: "/explore/places/[id]",
          params: {
            id: data._id,
          },
        });
      },

      toggleFavorite() {
        toggleFavorite(
          data,
          placeDetailsActions.favoritePlace,
          placeDetailsActions.unfavoritePlace
        );
      },

      toggleVisit() {
        toggleVisit(
          data,
          placeDetailsActions.visitPlace,
          placeDetailsActions.unvisitPlace
        );
      },

      share() {
        const title = "DongNaiTravelApp";
        const url = data.photos[0];
        const message = `Hãy cùng khám phá ${data.name} với mình nhé!`;
      },

      saveInformation(placeDetails: Place) {
        placeDetailsActions.add(placeDetails);
      },

      updateInformation(placeDetails: Place) {
        placeDetailsActions.update(placeDetails);
      },
    };

    return (
      <WrappedComponent
        {...props}
        getTextContentInHTMLTag={getTextContentInHTMLTag}
        actions={actions}
      />
    );
  };
}
