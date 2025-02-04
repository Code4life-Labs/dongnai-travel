// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type SignInScreenState = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    isChecked: false,
    isCheckBoxVisible: false,
    isTermConditionsVisible: false,
    isModalVisible: false,
    timestamp: Date.now(),
    dateTime: new Date(),
  };
}

function getStateFns(changeState: ChangeStateFn<SignInScreenState>) {
  return {
    setIsChecked(status?: boolean) {
      changeState("isChecked", function () {
        return Boolean(status);
      });
    },

    setIsCheckBoxVisible(status?: boolean) {
      changeState("isCheckBoxVisible", function () {
        return Boolean(status);
      });
    },

    setIsTermConditionsVisible(status?: boolean) {
      changeState("isTermConditionsVisible", function () {
        return Boolean(status);
      });
    },

    setIsModalVisible(status?: boolean) {
      changeState("isModalVisible", function () {
        return Boolean(status);
      });
    },

    setTimestamp(timestamp: number = Date.now()) {
      changeState("timestamp", function () {
        return timestamp;
      });
    },

    setDate(date: Date = new Date()) {
      changeState("dateTime", function () {
        return date;
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
