// Import types
import type { ChangeStateFn } from "@/hooks/useStateManager";

export type BlogEditorScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    content: "" as string | null,
    isContentFromStorage: false,
    isWebviewLoaded: false,
  };
}

function getStateFns(changeState: ChangeStateFn<BlogEditorScreenStateType>) {
  return {
    setContent(content: string | null) {
      changeState("content", function () {
        return content;
      });
    },

    setIsContentFromStorage(status?: boolean) {
      changeState("isContentFromStorage", function () {
        return Boolean(status);
      });
    },

    setIsWebviewLoaded(status?: boolean) {
      changeState("isWebviewLoaded", function () {
        return Boolean(status);
      });
    },
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};
