import { FlatList } from "react-native";
import React from "react";

// Import hooks
import { useStateManager } from "@/hooks/useStateManager";

// Import local state
import { StateManager } from "./state";

// Import types
import type { AppFlatlistProps } from "./type";
import type {
  FlatListProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

/**
 * Use to create a standard flatlist
 * @param configurations
 * @returns
 */
export default function AppFlatList<T = any>({
  fetchDataWhenEndReached,
  callWhenRefresh,
  callWhenTopReached,
  callWhenTopLeaved,
  ...props
}: AppFlatlistProps<T>) {
  const [state, stateFns] = useStateManager(
    StateManager.getInitialState(),
    StateManager.getStateFns
  );

  const handleOnMomentumScrollEnd = function (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    if (state.isEndReach) {
      if (props.data && props.data.length > 0) {
        stateFns.setIsFetching(true);
        fetchDataWhenEndReached().finally(() => {
          stateFns.setIsFetching(false);
        });
      }
      stateFns.setIsEndReach(false);
    }
  };
  const handleOnScroll = function (e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset } = e.nativeEvent;
    let val = contentOffset.y;
    if (val <= 0) {
      callWhenTopReached(stateFns);
    } else {
      callWhenTopLeaved(stateFns);
    }
  };
  const handleOnEndReached = function (info: { distanceFromEnd: number }) {
    stateFns.setIsEndReach(true);
  };
  const handleOnRefresh = function () {
    callWhenRefresh(stateFns);
  };
  const extractKey = function (item: T, index: number) {
    if ((item as any).id) return (item as any).id;
    if ((item as any)._id) return (item as any)._id;
    if ((item as any).key) return (item as any).key;
    return `index-${index}`;
  };

  return (
    <FlatList
      {...props}
      scrollEventThrottle={1000}
      onMomentumScrollEnd={handleOnMomentumScrollEnd}
      onScroll={handleOnScroll}
      onEndReached={handleOnEndReached}
      onRefresh={handleOnRefresh}
      keyExtractor={extractKey}
    />
  );
}
