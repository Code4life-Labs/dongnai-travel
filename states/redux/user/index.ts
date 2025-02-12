import { createSlice } from "@reduxjs/toolkit";

// Import types
import { User } from "@/objects/user/type";

type InitialState = {
  user: User | null;
  tempId: string | null;
  canRemember: boolean;
  ipv4: string | null;
};

// Phương: Khởi tạo giá trị một giá trị của Slice trong Redux
const initialState: InitialState = {
  user: null,
  tempId: null,
  canRemember: false,
  ipv4: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    update(state, action) {
      const data = action.payload;
      state.user = data.user;
      state.ipv4 = data.ipv4;
      state.tempId = data.tempId;
    },
    updateUser(state, action) {
      const user = action.payload;
      state.user = user;
    },
    updateTemporaryId(state, action) {
      const userId = action.payload;
      state.tempId = userId;
    },
    updateCanRemember(state, action) {
      const status = action.payload;
      state.canRemember = status;
    },
    updateIpv4(state, action) {
      const ipv4 = action.payload;
      state.ipv4 = ipv4;
    },
  },
});

// Phương: Action creators are generated for each case reducer function
// Phương: Actions: dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Phương: Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.

// Phương:
export const {
  update,
  updateUser,
  updateTemporaryId,
  updateCanRemember,
  updateIpv4,
} = userSlice.actions;

// Phương: Export default cái userReducer của chúng ta để combineReducers trong store
export const userReducer = userSlice.reducer;
