// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type ExploreScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    currentType: "all",
    isOnTop: true,
    status: {
      isFirstFetch: true,
      isEndReach: false,
      isReload: false,
    },
  };
}

function getStateFns(changeState: ChangeStateFn<ExploreScreenStateType>) {
  return {
    setCurrentType(type: string) {
      changeState("currentType", function () {
        return type;
      });
    },

    setIsOnTop(status?: boolean) {
      changeState("isOnTop", function () {
        return Boolean(status);
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
