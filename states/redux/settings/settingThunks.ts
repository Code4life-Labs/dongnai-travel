import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_ROOT = process.env.EXPO_DONGNAITRAVEL_API_URL;

const fetchSettingAsync = createAsyncThunk(
  'setting/fetchSetting',
  async () => {
    const response = await axios.get(`${API_ROOT}/v1/settings`);
    return response.data;
  }
);

const updateSettingAsync = createAsyncThunk(
  'setting/updateSetting',
  async (settingData: any) => {
    const response = await axios.put(`${API_ROOT}/v1/settings`, settingData);
    return response.data;
  }
);

export const settingThunks = {
  fetchSettingAsync,
  updateSettingAsync
};