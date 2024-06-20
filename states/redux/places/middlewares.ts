import { createAsyncThunk } from "@reduxjs/toolkit";

// Import types
import type { AppState } from "../type";
import type { Place } from "@/objects/place/type";

// import { getPlacesAPI, getPlaceDetailsWithPipelineAPI } from "apis/axios";

const getPlacesByTypeAsync = createAsyncThunk(
  "places/getPlacesByTypeAsync",
  async (payload: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState,
        type = payload,
        places = state.places.currentPlaces,
        limit = places ? places.limit : 5,
        skip = places ? places.skip : 0,
        query = `limit=${limit}&skip=${skip}&filter=quality:${type}`;
      const data = await getPlacesAPI(query);
      return [type, data];
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const getPlaceDetailsByIdAsync = createAsyncThunk(
  "places/getPlaceDetailsByIdAsync",
  async (payload: { placeId: string; lang: string }, thunkAPI) => {
    try {
      const { placeId, lang } = payload,
        query = `placeId=${placeId}&lang=${lang}`;
      const data = await getPlaceDetailsWithPipelineAPI(query);
      return [placeId, data];
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

export const placesThunks = {
  getPlacesByTypeAsync,
  getPlaceDetailsByIdAsync,
};