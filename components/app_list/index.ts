// import AppOrderedList from "./AppOrderedList";
// import AppUnorderedList from "./AppUnorderedList";
import AppListItem from "./AppListItem";

import { createList } from "./creatList";

const AppOrderedList = createList("ordered"),
  AppUnorderedList = createList("unordered");

export { AppOrderedList, AppUnorderedList, AppListItem };
