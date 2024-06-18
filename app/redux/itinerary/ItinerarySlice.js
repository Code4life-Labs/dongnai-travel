import { createSlice } from '@reduxjs/toolkit'

// Phương: Khởi tạo giá trị của một Slice trong redux
const initialState = {
  currentItinerary: {
    dataDay: [],
    textIntroduce: '',
    textEnding: ''
  }
}

// Phương: Khởi tạo một slice trong redux store
export const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    // Phương: Lưu ý luôn là ở đây cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong chỉ có 1 dòng, đây là rule của Redux
    // Phương: https:// Phương:redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    updateCurrentItinerary: (state, action) => {
      const itinerary = action.payload
      console.log("🚀 ~ file: ItinerarySlice.js:21 ~ itinerary:", itinerary)
      state.currentItinerary = itinerary
    }
  }
})

// Phương: Action creators are generated for each case reducer function
// Phương: Actions: dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Phương: Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.
export const { 
  updateCurrentItinerary
  // Phương
} = itinerarySlice.actions

// Phương: Selectors: mục đích là dành cho các components bên dưới gọi bằng useSelector() tới nó để lấy dữ liệu từ trong redux store ra sử dụng
export const selectCurrentItinerary = (state) => {
  return state.itinerary.currentItinerary
}

// Phương: Export default cái itineraryReducer của chúng ta để combineReducers trong store
export const itineraryReducer = itinerarySlice.reducer