import type { ChangeStateFn } from "@/hooks/useStateManager";

// Định nghĩa interface cho profile để tái sử dụng
interface ProfileState {
  currentUser: any | null;
  isMyProfile: boolean;
  selectedImage: string | null;
  uploadImageType: 'UploadCoverPhoto' | 'UploadAvatar' | null;
  isBottomSheetOpen: boolean;
}

export type ProfileScreenStateType = ReturnType<typeof getInitialState>;

function getInitialState() {
  return {
    currentManifold: {
      appearNotificationBottomSheet: false,
      contentNotificationBottomSheet: '',
      isLoading: false,
      privateKeys: null,
      hiddenStatusBar: false
    },
    profile: {
      currentUser: null,
      isMyProfile: true,
      selectedImage: null,
      uploadImageType: null,
      isBottomSheetOpen: false
    } as ProfileState,
    status: {
      isFirstFetch: true,
      isLoading: false,
      isError: false
    }
  };
}

function getStateFns(changeState: ChangeStateFn<ProfileScreenStateType>) {
  return {
    setCurrentManifold(manifold: {
      appearNotificationBottomSheet?: boolean;
      contentNotificationBottomSheet?: string;
      isLoading?: boolean;
      privateKeys?: any;
      hiddenStatusBar?: boolean;
    }) {
      changeState("currentManifold", function (currentManifold) {
        return { ...currentManifold, ...manifold };
      });
    },

    setProfile(profile: Partial<ProfileState>) {
      changeState("profile", function (currentProfile) {
        return { ...currentProfile, ...profile };
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
    },

    resetState() {
      changeState("profile", function () {
        return getInitialState().profile;
      });
      changeState("currentManifold", function () {
        return getInitialState().currentManifold;
      });
      changeState("status", function () {
        return getInitialState().status;
      });
    }
  };
}

export const StateManager = {
  getInitialState,
  getStateFns,
};