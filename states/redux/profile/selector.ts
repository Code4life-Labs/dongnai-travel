import type { AppState } from '../type';

export const profileSelectors = {
  selectCurrentProfile: (state: AppState) => state.profile.currentProfile,
  selectProfileStatus: (state: AppState) => state.profile.status,
  selectIsFirstFetch: (state: AppState) => state.profile.status.isFirstFetch,
  selectIsLoading: (state: AppState) => state.profile.status.isLoading,
  selectIsError: (state: AppState) => state.profile.status.isError
};
