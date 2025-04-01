import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  currentProfile: {
    currentUser: any | null;
    isMyProfile: boolean;
    selectedImage: string | null;
    uploadImageType: 'UploadCoverPhoto' | 'UploadAvatar' | null;
    isBottomSheetOpen: boolean;
  } | null;
  status: {
    isFirstFetch: boolean;
    isLoading: boolean;
    isError: boolean;
  };
}

const initialState: ProfileState = {
  currentProfile: null,
  status: {
    isFirstFetch: true,
    isLoading: false,
    isError: false
  }
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateCurrentProfile: (state, action: PayloadAction<ProfileState['currentProfile']>) => {
      state.currentProfile = action.payload;
    },
    updateProfileStatus: (state, action: PayloadAction<Partial<ProfileState['status']>>) => {
      state.status = { ...state.status, ...action.payload };
    },
    resetProfile: (state) => {
      state.currentProfile = initialState.currentProfile;
      state.status = initialState.status;
    }
  }
});

export const profileActions = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
