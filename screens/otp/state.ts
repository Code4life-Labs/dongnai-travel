// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type SignInScreenState = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    OTPCode: "",
    countdownValue: 30,
    enableResend: false,
  };
}

function getStateFns(changeState: ChangeStateFn<SignInScreenState>) {
  return {
    setOTPCode(code: string) {
      changeState("OTPCode", function () {
        return code;
      });
    },

    setCountDownValue(countdownValue: number) {
      changeState("countdownValue", function () {
        return countdownValue;
      });
    },

    setEnableResend(status?: boolean) {
      changeState("enableResend", function () {
        return Boolean(status);
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
