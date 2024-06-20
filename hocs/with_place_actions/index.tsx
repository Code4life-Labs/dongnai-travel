import React from "react";
import { useNavigation } from "@react-navigation/native";

// Import from hooks
import {
  usePlaceDetailsActions,
  useBriefPlacesActions,
  usePlaceInteractionActions,
} from "hooks/usePlace";

// Import from utils
import { StringUtils } from "@/utils/string";

// Import types
import type { WrappedComponentProps } from "./type";

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
export function withPlaceActions<T extends any>(
  WrappedComponent: (props: T & WrappedComponentProps) => JSX.Element
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
    const navigation = useNavigation();
    const { addPlaceDetails } = usePlaceDetailsActions();
    const { updateBriefPlace } = useBriefPlacesActions(typeOfBriefPlace);
    const { extendedPlaceInfo, likePlace } = usePlaceInteractionActions(place);

    /**
     * Hàm này dùng để mở một place details.
     */
    const handlePressImageButton = () => {
      addPlaceDetails(place);
      navigation.push("PlaceDetailScreen", {
        placeId: place.place_id,
        typeOfBriefPlace: typeOfBriefPlace,
        handleShareToSocial: handleShareToSocial,
      });
    };

    /**
     * Hàm này dùng để yêu thích / bỏ yêu thích một place, nó sẽ gửi id của place về server và tự server nó sẽ xử lý.
     */
    const handleLikeButton = () =>
      likePlace(
        (_, state: boolean) =>
          updateBriefPlace(place.place_id, placeIndex, { isLiked: state }),
        (state: boolean) =>
          updateBriefPlace(place.place_id, placeIndex, { isLiked: state })
      );

    // Hàm này dùng để cho việc share ảnh
    const handleShareToSocial = () => {
      const title = "DongNaiTravelApp";
      const url = place.place_photos[0];
      const message = `Hãy cùng khám phá ${place.name} với mình nhé!`;
    };

    return (
      <WrappedComponent
        {...props}
        extendedPlaceInfo={extendedPlaceInfo}
        addPlaceDetails={addPlaceDetails}
        updateBriefPlace={updateBriefPlace}
        getTextContentInHTMLTag={getTextContentInHTMLTag}
        handlePressImageButton={handlePressImageButton}
        handleLikeButton={handleLikeButton}
        handleShareToSocial={handleShareToSocial}
      />
    );
  };
}
