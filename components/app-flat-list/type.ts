// Import types
import type { FlatListProps } from "react-native";
import type { AppFlatlistStateFunctionsType } from "./state";

export type DataKeys = {
  id?: string;
  _id?: string;
  key?: string;
};
export type AppFlatlistProps<T = any> = {
  fetchDataWhenEndReached(): Promise<any>;
  callWhenRefresh(stateFns: AppFlatlistStateFunctionsType): void;
  callWhenTopReached(stateFns: AppFlatlistStateFunctionsType): void;
  callWhenTopLeaved(stateFns: AppFlatlistStateFunctionsType): void;
} & FlatListProps<T>;
