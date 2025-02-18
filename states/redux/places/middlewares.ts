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

      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;
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
      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;

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

const favoritePlaceAsync = createAsyncThunk(
  "places/favoritePlaceAsync",
  async (placeId: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;

      await PlaceManager.Api.postFavoritedPlaceAsync(userId, placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const unfavoritePlaceAsync = createAsyncThunk(
  "places/unfavoritePlaceAsync",
  async (placeId: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;

      await PlaceManager.Api.deleteFavoritedPlaceAsync(userId, placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const visitPlaceAsync = createAsyncThunk(
  "places/visitPlaceAsync",
  async (placeId: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;

      await PlaceManager.Api.postVisitedPlaceAsync(userId, placeId);
      return placeId;
    } catch (error: any) {
      console.error(error.message);
    }
  }
);

const unvisitPlaceAsync = createAsyncThunk(
  "places/unvisitPlaceAsync",
  async (placeId: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as AppState;
      const userInStorage = await UserManager.Storage.get();
      const userId = userInStorage
        ? userInStorage.user.userId
        : state.user.user?._id;

      await PlaceManager.Api.deleteVisitedPlaceAsync(userId, placeId);
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
