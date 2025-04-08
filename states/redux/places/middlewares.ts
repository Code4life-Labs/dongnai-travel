import { createAsyncThunk } from "@reduxjs/toolkit";

// Import from objects
import { PlaceManager } from "@/objects/place";
import { UserManager } from "@/objects/user";

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

      const data = await PlaceManager.Api.getPlacesAsync({
        limit,
        skip,
        type,
      });

      return [type, data] as [string, Array<Place>];
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const getPlaceDetailAsync = createAsyncThunk(
  "places/getPlaceDetailAsync",
  async (payload: any) => {
    const { id, lang } = payload;

    try {
      const data = await PlaceManager.Api.getPlaceAsync({
        id,
        lang,
      });
      return [id, data] as [string, Place];
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

const favoritePlaceAsync = createAsyncThunk(
  "places/favoritePlaceAsync",
  async (placeId: string) => {
    try {
      await PlaceManager.Api.postFavoritedPlaceAsync(placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const unfavoritePlaceAsync = createAsyncThunk(
  "places/unfavoritePlaceAsync",
  async (placeId: string) => {
    try {
      await PlaceManager.Api.deleteFavoritedPlaceAsync(placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const visitPlaceAsync = createAsyncThunk(
  "places/visitPlaceAsync",
  async (placeId: string) => {
    try {
      await PlaceManager.Api.postVisitedPlaceAsync(placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const unvisitPlaceAsync = createAsyncThunk(
  "places/unvisitPlaceAsync",
  async (placeId: string) => {
    try {
      await PlaceManager.Api.deleteVisitedPlaceAsync(placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

export const placesThunks = {
  getPlacesAsync,
  getPlaceDetailAsync,
  getPlaceTypesAsync,
  favoritePlaceAsync,
  unfavoritePlaceAsync,
  visitPlaceAsync,
  unvisitPlaceAsync,
};
