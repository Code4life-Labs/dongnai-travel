// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type AppFlatlistStateType = ReturnType<typeof getInitialState>;
export type AppFlatlistStateFunctionsType = ReturnType<typeof getStateFns>;

function getInitialState() {
  return {
    isOnTop: true,
    isFetching: false,
    isEndReach: false,
  };
}

function getStateFns(changeState: ChangeStateFn<AppFlatlistStateType>) {
  return {
    setIsOnTop(status?: boolean) {
      changeState("isOnTop", function () {
        return Boolean(status);
      });
    },

    setIsFetching(status?: boolean) {
      changeState("isFetching", function () {
        return Boolean(status);
      });
    },

    setIsEndReach(status?: boolean) {
      changeState("isEndReach", function () {
        return Boolean(status);
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
