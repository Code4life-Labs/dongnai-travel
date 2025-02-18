import { createSlice } from "@reduxjs/toolkit";

// Import objects
import { UserManager } from "@/objects/user";

// Import utils
import { StorageUtils } from "@/utils/storage";

// Import types
import { User } from "@/objects/user/type";

type InitialState = {
  user: User | null;
  token: string | null;
  tempId: string | null;
  canRemember: boolean;
  ipv4: string | null;
};

// Phương: Khởi tạo giá trị một giá trị của Slice trong Redux
const initialState: InitialState = {
  user: null,
  token: null,
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
    setUser(state, action) {
      const user = action.payload;
      state.user = user;
    },
    updateUser(state, action) {
      const user = action.payload;
      state.user = Object.assign({}, state.user, user);
    },
    setTemporaryId(state, action) {
      const userId = action.payload;
      state.tempId = userId;
    },
    setCanRemember(state, action) {
      const status = action.payload;
      state.canRemember = status;
    },
    setRememberedUserData(state, action) {
      if (state.canRemember)
        UserManager.Storage.save({
          user: action.payload.user,
          token: action.payload.token,
        });

      state.token = action.payload.token;
    },
    setIpv4(state, action) {
      const ipv4 = action.payload;
      state.ipv4 = ipv4;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    resetToken(state) {
      state.token = null;
    },
    reset(state) {
      state = { ...initialState };
    },
  },
});

// Phương: Action creators are generated for each case reducer function
// Phương: Actions: dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Phương: Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên của reducer nhé.

// Phương:
export const userActions = userSlice.actions;

// Phương: Export default cái userReducer của chúng ta để combineReducers trong store
export const userReducer = userSlice.reducer;
