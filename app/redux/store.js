import { configureStore } from '@reduxjs/toolkit'

import { blogsReducer } from 'redux/blogs/BlogsSlice'
import { notifsReducer } from './notifications/NotificationsSlice'
import { placesReducer } from 'redux/places/PlacesSlice'
import { mapReducer } from 'redux/map/mapSlice'
import { profileReducer } from 'redux/profile/ProfileSlice'
import { settingReducer } from 'redux/setting/SettingSlice'
import { userReducer } from 'redux/user/UserSlice'
import { manifoldReducer } from 'redux/manifold/ManifoldSlice'
import { warehouseReducer } from 'redux/warehouse/WareHouseSlice'
import { filterReducer } from 'redux/filter/FilterSlice'
import { languageReducer } from 'redux/language/LanguageSlice'
import { itineraryReducer } from 'redux/itinerary/ItinerarySlice'

// https://www.npmjs.com/package/redux-persist
// https://blog.logrocket.com/use-redux-persist-react-native/
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore } from 'redux-persist'
import { themeReducer } from './theme/ThemeSlice'


const persistConfig = {
  key: 'root',
  // Phuong: luu tru o localstorage
  storage: AsyncStorage,
  // Phuong: định nghĩa các slice được phép duy trì qua mỗi lần reload, hoặc đóng ứng dụng tạm thời
  whitelist: ['user', 'warehouse']
  // Phuong: blacklist: ['user'] // Phuong: định nghĩa các slice không được phép duy trì qua mỗi lần reload, hoặc đóng ứng dụng tạm thời
}

const reducers = combineReducers({
  blogs: blogsReducer,
  notifs: notifsReducer,
  places: placesReducer,
  map: mapReducer,
  profile: profileReducer,
  setting: settingReducer,
  user: userReducer,
  manifold: manifoldReducer,
  warehouse: warehouseReducer,
  filter: filterReducer,
  theme: themeReducer,
  language: languageReducer,
  itinerary: itineraryReducer,
})

const persistedReducers = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // Phuong: Fix warning error when implement redux-persist
  // Phuong: https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export const persistor = persistStore(store)