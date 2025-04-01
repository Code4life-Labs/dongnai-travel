// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type SettingsScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    notification: {
      updateFromFollowing: false,
      comments: false,
      events: false
    },
    darkMode: false,
    status: {
      isFirstFetch: true,
      isLoading: false,
      isError: false
    }
  };
}

function getStateFns(changeState: ChangeStateFn<SettingsScreenStateType>) {
  return {
    setNotification(notification: {
      updateFromFollowing: boolean;
      comments: boolean;
      events: boolean;
    }) {
      changeState("notification", function () {
        return notification;
      });
    },

    setDarkMode(status?: boolean) {
      changeState("darkMode", function () {
        return Boolean(status);
      });
    },

    setStatus(status: {
      isFirstFetch?: boolean;
      isLoading?: boolean;
      isError?: boolean;
    }) {
      changeState("status", function (currentStatus) {
        return { ...currentStatus, ...status };
      });
    }
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
