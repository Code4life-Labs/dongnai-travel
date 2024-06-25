// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type ButtonsScrollBarState = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    currentIndex: 0,
    isViewLayouted: false,
  };
}

function getStateFns(changeState: ChangeStateFn<ButtonsScrollBarState>) {
  return {
    setCurrentIndex(arg: ((prev: number) => number) | number) {
      changeState("currentIndex", function (prevState) {
        if (typeof arg === "number") {
          return arg;
        }

        return arg(prevState);
      });
    },

    setIsViewLayouted(status?: boolean) {
      changeState("isViewLayouted", function () {
        return Boolean(status);
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
