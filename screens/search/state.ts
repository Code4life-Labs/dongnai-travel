// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

// Import types
import type { SearchResult } from "./types";
import { result } from "lodash";

type SearchType = "place" | "blog" | "user";
export type SearchScreenStateType = ReturnType<typeof getInitialState>;

export const SEARCH_TYPES = ["place", "blog", "user"] as const;

function getInitialState() {
  return {
    searchResults: [] as Array<SearchResult>,
    type: "place" as SearchType,
  };
}

function getStateFns(changeState: ChangeStateFn<SearchScreenStateType>) {
  return {
    setSearchResults(results: Array<SearchResult>) {
      changeState("searchResults", function () {
        return results;
      });
    },

    changeSearchType(searchType: SearchType) {
      changeState("type", function () {
        return searchType;
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
