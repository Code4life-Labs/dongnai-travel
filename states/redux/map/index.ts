import { createSlice } from "@reduxjs/toolkit";

export const mapSlice = createSlice({
  name: "map",
  initialState: {
    currentMap: {
      places: [],
      routes: [],
      suggestions: [],
      mapTypes: "standard",
      mapDetails: false,
      userLocation: null,
    },
  },
  reducers: {
    updateCurrentMap(state, action) {
      const map = action.payload;
      state.currentMap = map;
    },

    updatePlaces(state, action) {
      const places = action.payload;
      state.currentMap.places = places;
    },

    updateRoutes(state, action) {
      const routes = action.payload;
      state.currentMap.routes = routes;
    },

    updateSuggestions(state, action) {
      const suggestions = action.payload;
      state.currentMap.suggestions = suggestions;
    },

    updateMapTypes(state, action) {
      const mapTypes = action.payload;
      state.currentMap.mapTypes = mapTypes;
    },

    updateMapDetails(state, action) {
      const mapDetails = action.payload;
      state.currentMap.mapDetails = mapDetails;
    },

    updateUserLocation(state, action) {
      const userLocation = action.payload;
      state.currentMap.userLocation = userLocation;
    },
  },
});

export const mapActions = mapSlice.actions;
