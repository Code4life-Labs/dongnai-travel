import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import slices
import { themeSlice } from "./theme";
import { blogsSlice } from "./blogs";
// import { notificationSlice } from "./notifications";
import { placesSlice } from "./places";
import { mapSlice } from "./map";
// import { profileSlice } from "./profile";
// import { settingSlice } from "./setting";
import { userSlice } from "./user";
import { manifoldSlice } from "./manifold";
// import { warehouseSlice } from "./warehouse";
// import { filterSlice } from "./filter";
import { languageSlice } from "./language";
// import { itinerarySlice } from "./itinerary";

// Central Reducer.
const reducers = combineReducers({
  [themeSlice.name]: themeSlice.reducer,
  [blogsSlice.name]: blogsSlice.reducer,
  // [notificationSlice.name]: notificationSlice.reducer,
  [placesSlice.name]: placesSlice.reducer,
  [mapSlice.name]: mapSlice.reducer,
  // [profileSlice.name]: profileSlice.reducer,
  // [settingSlice.name]: settingSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [manifoldSlice.name]: manifoldSlice.reducer,
  // [warehouseSlice.name]: warehouseSlice.reducer,
  // [filterSlice.name]: filterSlice.reducer,
  [languageSlice.name]: languageSlice.reducer,
  // [itinerarySlice.name]: itinerarySlice.reducer,
});

const persistConfig = {
  key: "root",
  // Phuong: luu tru o localstorage
  storage: AsyncStorage,
  // Phuong: định nghĩa các slice được phép duy trì qua mỗi lần reload, hoặc đóng ứng dụng tạm thời
  whitelist: ["user", "warehouse"],
  // Phuong: blacklist: ['user'] // Phuong: định nghĩa các slice không được phép duy trì qua mỗi lần reload, hoặc đóng ứng dụng tạm thời
};

const persistedReducers = persistReducer(persistConfig, reducers);

/**
 * Redux will be use as state manager in this app. It must be installed in `App.tsx` and
 * its actions and selectors must have a __hook wrapping outside__.
 */
export const store = configureStore({
  reducer: persistedReducers,
  // Phuong: Fix warning error when implement redux-persist
  // Phuong: https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
