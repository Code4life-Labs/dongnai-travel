import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

const API_ROOT = process.env.EXPO_DONGNAITRAVEL_API_URL;

interface SettingData {
  notification?: {
    updateFromFollowing: boolean;
    comments: boolean;
    events: boolean;
  };
  darkMode?: boolean;
}

const fetchSettingAsync = createAsyncThunk(
  'setting/fetchSetting',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ROOT}/v1/settings`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch settings');
    }
  }
);

const updateSettingAsync = createAsyncThunk(
  'setting/updateSetting',
  async (settingData: SettingData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_ROOT}/v1/settings`, settingData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to update settings');
    }
  }
);

export const settingThunks = {
  fetchSettingAsync,
  updateSettingAsync
};