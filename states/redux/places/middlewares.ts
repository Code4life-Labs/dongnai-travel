import { createAsyncThunk } from "@reduxjs/toolkit";

// Import from objects
import { PlaceManager } from "@/objects/place";

// Import types
import type { AppState } from "../type";
import type { Place } from "@/objects/place/type";

// import { getPlacesAPI, getPlaceDetailsWithPipelineAPI } from "apis/axios";

const getPlacesAsync = createAsyncThunk(
  "places/getPlacesAsync",
  async (payload: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState,
        type = payload,
        places = state.places.briefPlaceListInformation,
        limit = places ? places.limit : 5,
        skip = places ? places.skip : 0;
      const userId = state.user.user?._id;

      const data = await PlaceManager.Api.getPlacesAsync({
        limit,
        skip,
        type,
        userId,
      });

      return [type, data] as [string, Array<Place>];
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const getPlaceDetailAsync = createAsyncThunk(
  "places/getPlaceDetailAsync",
  async (payload: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userId = state.user.user?._id;

      const data = await PlaceManager.Api.getPlaceAsync({
        id: payload,
        userId,
      });

      return [payload, data] as [string, Place];
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const getPlaceTypesAsync = createAsyncThunk(
  "places/getPlaceTypesAsync",
  async () => {
    try {
      const data = await PlaceManager.Api.getPlaceTypes();
      return data;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

export const placesThunks = {
  getPlacesAsync,
  getPlaceDetailAsync,
  getPlaceTypesAsync,
};
