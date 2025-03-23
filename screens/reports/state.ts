// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type ReportsScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    isOnTop: true,
    status: {
      isFirstFetch: true,
      isEndReach: false,
      isReload: false,
    },
  };
}

function getStateFns(changeState: ChangeStateFn<ReportsScreenStateType>) {
  return {
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
