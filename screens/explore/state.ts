// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type ExploreScreenState = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    currentType: "all",
    isOnTop: true,
  };
}

function getStateFns(changeState: ChangeStateFn<ExploreScreenState>) {
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
