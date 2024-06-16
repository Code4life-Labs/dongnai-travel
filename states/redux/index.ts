import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import slices
import { themeSlice } from "./theme";

// Central Reducer.
const reducers = combineReducers({
  [themeSlice.name]: themeSlice.reducer,
});

/**
 * Redux will be use as state manager in this app. It must be installed in `App.tsx` and
 * its actions and selectors must have a __hook wrapping outside__.
 */
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
