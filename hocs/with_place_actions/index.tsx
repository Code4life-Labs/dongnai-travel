import React from "react";
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
 * import { createPlaceCard } from 'hocs/createPlaceCard'
 *
 * function HorizontalPlaceCard({...}) {...}
 *
 * export default createPlaceCard(HorizontalPlaceCard)
 *
 * // OR
 * import { createPlaceCard } from 'hocs/createPlaceCard'
 *
 * function VerticalPlaceCard({...}) {...}
 *
 * export default createPlaceCard(VerticalPlaceCard)
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

  /**
   * Component này sẽ nhận một component khác và bọc nó lại, đồng thời function này sẽ truyền logic lại cho
   * component được bọc đó (WrappedComponent).
   * @param props Props của component.
   */
  return function (props: T) {
    const { data } = props as any;

    const placeDetailsDispatchers = usePlaceDetailsActions();

    const actions: WithPlaceActions_Actions = {
      navigate() {
        placeDetailsDispatchers.add(data);
        router.navigate(`/${data._id}`);
      },

      like() {
        data.isLiked = !data.isLiked;
        // Call API

        // Update state if call api successfully
        placeDetailsDispatchers.update(data);
      },

      visit() {
        data.isVisited = !data.isVisited;
        // Call API

        // Update state if call api successfully
        placeDetailsDispatchers.update(data);
      },

      share() {
        const title = "DongNaiTravelApp";
        const url = data.photos[0];
        const message = `Hãy cùng khám phá ${data.name} với mình nhé!`;
      },

      saveInformation(placeDetails: Place) {
        placeDetailsDispatchers.add(placeDetails);
      },

      updateInformation(placeDetails: Place) {
        placeDetailsDispatchers.update(placeDetails);
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
