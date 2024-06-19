import type { store } from "./index";

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
