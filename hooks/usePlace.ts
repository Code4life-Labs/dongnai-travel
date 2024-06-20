import React from "react";
import { useSelector, useDispatch } from "react-redux";

// Import actions
import { placesActions } from "@/states/redux/places";

// Import selectors
import { placesSelectors } from "@/states/redux/places/selectors";

// Import types
import type { AppState, AppDispatch } from "@/states/redux/type";
import type { Place } from "@/objects/place/type";

export const { usePlaces, usePlacesActions, usePlacesState } = (function () {
  const createDispatchers = function (dispatch: AppDispatch) {
    return {
      updateBriefPlace(id: string, briefPlace: Partial<Place>) {
        dispatch(placesActions.updateBriefPlace({ id, briefPlace }));
      },

      increaseSkipBriefPlacesAmount() {
        dispatch(placesActions.increaseSkipBriefPlacesAmount());
      },

      decreaseSkipBriefPlacesAmount() {
        dispatch(placesActions.decreaseSkipBriefPlacesAmount());
      },

      clearCurrentPlaces() {
        dispatch(placesActions.clearCurrentPlaces());
      },
    };
  };

  const select = function (_useSelector: typeof useSelector) {
    return _useSelector(placesSelectors.selectCurrentPlaces);
  };

  return {
    /**
     * Use this hook to manage `places` and get actions to
     * manipulate `places`
     * @returns
     */
    usePlaces() {
      const dispatch = useDispatch();
      const placesDispatchers = createDispatchers(dispatch);
      const places = select(useSelector);

      return {
        places,
        placesDispatchers,
      };
    },

    /**
     * Use this hook to get only actions, it does not affect component's
     * life cycle when `places` is updated
     * @returns
     */
    usePlacesActions() {
      const dispatch = useDispatch();
      return createDispatchers(dispatch);
    },

    /**
     * Use this hook to get only `places`
     * @returns
     */
    usePlacesState() {
      return select(useSelector);
    },
  };
})();

export const { usePlaceDetails, usePlaceDetailsActions, usePlaceDetailsState } =
  (function () {
    const createDispatchers = function (dispatch: AppDispatch) {
      return {
        addPlaceDetails(placeDetails: Place) {
          dispatch(placesActions.addPlaceDetails(placeDetails));
        },

        updatePlaceDetails(placeDetails: Place) {
          dispatch(
            placesActions.updatePlaceDetails({
              id: placeDetails._id,
              placeDetails,
            })
          );
        },

        remove(id: string) {
          dispatch(placesActions.clearPlaceDetails(id));
        },
      };
    };

    const select = function (_useSelector: typeof useSelector, id: string) {
      return _useSelector((state: AppState) =>
        placesSelectors.selectPlaceDetails(state, id)
      );
    };

    return {
      /**
       * Use this hook to manage `place's details` and get actions to
       * manipulate `place's details`
       * @returns
       */
      usePlaceDetails(id: string) {
        const dispatch = useDispatch();
        const placeDispatchers = createDispatchers(dispatch);
        const place = select(useSelector, id);

        return {
          place,
          placeDispatchers,
        };
      },

      /**
       * Use this hook to get only actions, it does not affect component's
       * life cycle when `place's details` is updated
       * @returns
       */
      usePlaceDetailsActions() {
        const dispatch = useDispatch();
        return createDispatchers(dispatch);
      },

      /**
       * Use this hook to get only `place's details`
       * @returns
       */
      usePlaceDetailsState(id: string) {
        return select(useSelector, id);
      },
    };
  })();

/**
 * Hook này dùng để sử dụng API `updateByCaseAPI` để tương tác với Place, API này được dùng trong các actions.
 * Có 2 loại actions là `Toggle` và `Normal`
 * - Toggle: là kiểu tương tác chuyển đổi, khi tương tác kiểu này, thì action ban đầu sẽ được chuyển đổi sang action khác
 * và khi tương tác tiếp thì nó sẽ chuyển đổi về action ban đầu. VD: `yêu thích` và `bỏ yêu thích`.
 * - Normal: là kiểu tương tác bình thường, khi tương tác kiểu này thì action không bị chuyển đổi. VD: `báo cáo địa điểm`.
 *
 * Các toggle actions như là `yêu thích` hoặc `bỏ yêu thích`, `đánh dấu là đã ghé thăm` hoặc là
 * `bỏ đánh dấu là đã ghé thăm` thì những hành động này là mình đang tương tác với Place để lấy dữ liệu (`place_id`)
 * và lưu nó vào trong dữ liệu của một `user` nào đó. Place này được trực quan hoá bằng Card hoặc xem chi tiết (PlaceDetailScreen).
 *
 * Tương lai có thể add thêm một số actions khác như là `báo cáo địa điểm`, `xem địa điểm trên bản đồ`.
 *
 * @param place Dữ liệu của place.
 * @returns
 * @example
 * ...
 * import { usePlaceInteractionAPI } from 'customHooks/usePlace'
 *
 * function MyComponent({place, placeIndex}) {
 *   // Ta có likePlace và visitPlace là 2 interact actions
 *   let { extendedPlaceInfo, likePlace, visitPlace } = usePlaceInteractionAPI(place);
 *
 *   let handleLikeButton = () => likePlace(
 *     // Hàm này sẽ được gọi khi
 *     (data, state) => updatePlaceDetail(place.place_id, placeIndex, { isLiked: state }),
 *     (state) => updatePlaceDetail(place.place_id, placeIndex, { isLiked: state })
 *   )
 * }
 * ...
 */
export function usePlaceInteractionActions(place: Partial<Place>) {
  const [extendedPlaceInfo, setExtendedPlaceInfo] = React.useState({
    isLiked: place?.isLiked ? true : false,
    isVisited: place?.isVisited ? true : false,
  });

  /**
   * Hàm này sẽ tạo ra một function dùng để sử dụng Interaction Actions. Interaction Actions là các Actions dùng để
   * sử dụng tính năng tương tác với địa điểm như là thích, ghé thăm hoặc ghi review ngắn về một địa điểm.
   * Thì hàm này dùng để tạo ra các Toggle Interaction Actions, `Toggle Action` là sự tương tác chuyển đổi,
   * chuyển đổi ở đây là chuyển đổi boolean giữa true và false.
   *
   * Ví dụ có một địa điểm A, và dựa vào kết quả trả về từ server thì người dùng này chưa thích địa điểm A, và
   * cũng chưa ghé thăm, thì khi đó state của `isLiked` và `isVisited` sẽ là `false`. Nếu như ấn like thì state
   * của `isLiked = true` và mình cũng có thể bỏ thích địa điểm này. Đó là lí do vì sao nó được gọi là Toggle Interaction.
   *
   * Bởi vì dùng API `updateByCaseAPI` và tính chuyển đổi của nó, cho nên là hàm này sẽ nhận vào 2 tham số là
   * `updateCaseWhenActive` và `updateCaseWhenInActive`. Và vì có nhiều Toggle Actions cho nên mình phải nhận thêm
   * thêm một tham số nữa là `toggleInteraction`.
   *
   * @example
   * // Ví dụ với yêu thích / bỏ yêu thích địa điểm thì mình sẽ có 2 case để update đó là add hoặc remove `place_id`
   * // ra khởi `savedPlaces` của user.
   *
   * const handleLikeButton = createToggleInteractionAPIFunc("isLiked", UPDATE_USER_CASES["addEle:savedPlaces"], UPDATE_USER_CASES["removeEle:savedPlaces"]);
   *
   * // Các hàm gọi toggle interaction API này đều nhận vào 2 callback để xử lý khi API gọi thành công hoặc thất bại. Chủ yếu là xử lý dữ liệu.
   * handleLikeButton(
   *   (data, state) => updatePlaceDetail(placeId, placeIndex, updateData),
   *   (state) => updatePlaceDetail(placeId, placeIndex, updateData)
   * )
   */
  const createToggleInteractionActionsFunc = React.useCallback(
    /**
     * @param {"isLiked" | "isVisited"} toggleInteraction
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
        setExtendedPlaceInfo((prevState) => {
          let state = true;
          let updateCase = updateCaseWhenActive;
          if (prevState[toggleInteraction]) {
            state = false;
            updateCase = updateCaseWhenInActive;
          }
          let data = {
            updateCase: updateCase,
            updateData: place.place_id,
          };
          updateUserByCaseAPI(data)
            .then((data) => {
              // Update lên store.
              if (callWhenAPIResolve) callWhenAPIResolve(data, state);
            })
            .catch((error) => {
              if (callWhenAPIReject) callWhenAPIReject(!state);
              setExtendedPlaceInfo((prevState) => ({
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
   * Hàm này dùng để yêu thích một place, nó sẽ gửi id của place về server và tự server nó sẽ xử lý.
   */
  const { likePlace, visitPlace } = React.useMemo(
    () => ({
      /**
       * Hàm này dùng để yêu thích/bỏ yêu thích một địa điểm nào đó. Nhận vào hai tham số là
       * `callWhenAPIResolve` và `callWhenAPIReject`
       */
      likePlace: createToggleInteractionActionsFunc(
        "isLiked",
        UPDATE_USER_CASES["addEle:savedPlaces"],
        UPDATE_USER_CASES["removeEle:savedPlaces"]
      ),
    }),
    []
  );

  React.useEffect(() => {
    // console.log("Isliked from place: ", Boolean(place.isLiked));
    if (Boolean(place.isLiked) !== extendedPlaceInfo.isLiked) {
      setExtendedPlaceInfo((prevState) => ({
        ...prevState,
        isLiked: Boolean(place.isLiked),
      }));
    }

    if (Boolean(place.isVisited) !== extendedPlaceInfo.isVisited) {
      setExtendedPlaceInfo((prevState) => ({
        ...prevState,
        isVisited: Boolean(place.isVisited),
      }));
    }
  }, [place.isLiked, place.isVisited]);

  return {
    extendedPlaceInfo,
    likePlace,
    visitPlace,
  };
}
