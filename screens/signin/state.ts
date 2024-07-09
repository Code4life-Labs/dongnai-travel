// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type SignInScreenState = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    isEmailNameFocused: false,
    isPasswordFocused: false,
    isRememberMeChecked: false,
  };
}

function getStateFns(changeState: ChangeStateFn<SignInScreenState>) {
  return {
    setIsEmailNameFocused(status?: boolean) {
      changeState("isEmailNameFocused", function () {
        return Boolean(status);
      });
    },

    setIsPasswordFocused(status?: boolean) {
      changeState("isPasswordFocused", function () {
        return Boolean(status);
      });
    },

    setIsRememberMeChecked(status?: boolean) {
      changeState("isRememberMeChecked", function () {
        return Boolean(status);
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
