import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ROOT } from '@/constants/api';
import { profileActions } from '.';

export const fetchProfileData = createAsyncThunk(
  'profile/fetchProfileData',
  async (_, { dispatch }) => {
    try {
      dispatch(profileActions.updateProfileStatus({ isLoading: true }));
      const response = await axios.get(`${API_ROOT}/v1/profile`);
      dispatch(profileActions.updateCurrentProfile(response.data));
      dispatch(profileActions.updateProfileStatus({ 
        isLoading: false, 
        isFirstFetch: false 
      }));
      return response.data;
    } catch (error) {
      dispatch(profileActions.updateProfileStatus({ 
        isLoading: false, 
        isError: true 
      }));
      throw error;
    }
  }
);

export const updateProfileData = createAsyncThunk(
  'profile/updateProfileData',
  async (profileData: any, { dispatch }) => {
    try {
      dispatch(profileActions.updateProfileStatus({ isLoading: true }));
      const response = await axios.put(`${API_ROOT}/v1/profile`, profileData);
      dispatch(profileActions.updateCurrentProfile(response.data));
      dispatch(profileActions.updateProfileStatus({ isLoading: false }));
      return response.data;
    } catch (error) {
      dispatch(profileActions.updateProfileStatus({ 
        isLoading: false, 
        isError: true 
      }));
      throw error;
    }
  }
);
