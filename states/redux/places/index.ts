import { createSlice } from "@reduxjs/toolkit";

// Import utils
import { ArrayUtils } from "@/utils/array";
import { BooleanUtils } from "@/utils/boolean";
import { NumberUtils } from "@/utils/number";

// Import types
import type { Place, PlaceType } from "@/objects/place/type";

import { placesThunks } from "./middlewares";

type InitialState = {
  types: Array<PlaceType>;
  placeDict: Record<string, Place>;
  briefPlaceListInformation: {
    type: string;
    limit: number;
    skip: number;
    data: Array<Partial<Place>>;
    status: {
      isFetching: boolean;
    };
  };
};

/**
 * Use to create brief places to manage current places
 * @param limit
 * @param skip
 * @returns
 */
function _createDefaultBriefPlace(limit = 5, skip = 0) {
  return {
    type: "",
    limit: limit,
    skip: skip,
    data: [] as Array<Partial<Place>>,
    status: {
      isFetching: false,
    },
  };
}

const _DefaultTypes = [
  {
    value: "all",
    name: "All",
  },
  {
    value: "recommended",
    name: "Recommended",
  },
] as Array<PlaceType>;

const initialState: InitialState = {
  types: [],
  placeDict: Object(),
  briefPlaceListInformation: _createDefaultBriefPlace(),
};

export const placesSlice = createSlice({
  name: "places",
  initialState: { ...initialState },
  reducers: {
    /**
     * Use to add a places details to Map (for caching)
     * @param state
     * @param action
     */
    addPlace(state, action) {
      const place = action.payload as Place;
      if (!state.placeDict[place._id]) state.placeDict[place._id] = place;
    },

    /**
     * Use to update an existing place's details with `id`
     * @param state
     * @param action
     */
    updatePlace(state, action) {
      const { id, place } = action.payload as {
        id: string;
        place: Place;
      };

      state.placeDict[id] = place;
    },

    /**
     * Use to clear a place details by id
     * @param state
     * @param action
     */
    clearPlace(state, action) {
      let placeId = action.payload;
      if (state.placeDict[placeId]) delete state.placeDict[placeId];
    },

    /**
     * Use to update a brief place (for caching)
     * @param state
     * @param action
     */
    updateBriefPlace(state, action) {
      let { placeIndex, updateData } = action.payload;
      if (BooleanUtils.isEmpty(placeIndex)) return;

      let place = state.briefPlaceListInformation.data![placeIndex];
      if (place) {
        state.briefPlaceListInformation.data = ArrayUtils.updateAt(
          state.briefPlaceListInformation.data!,
          placeIndex,
          Object.assign(place, updateData)
        );
      }
    },

    /**
     * Use to update amount of skip
     * @param state
     * @param action
     */
    increaseSkipInBriefPlaceListInformation(state) {
      state.briefPlaceListInformation.skip +=
        state.briefPlaceListInformation.skip;
    },

    /**
     * Use to decrease amount of skip, prevent the value lower than 0
     * @param state
     * @param action
     */
    decreaseSkipInBriefPlaceListInformation(state) {
      state.briefPlaceListInformation.skip = NumberUtils.decreaseByAmount(
        state.briefPlaceListInformation.skip,
        state.briefPlaceListInformation.limit
      );
    },

    /**
     * Use to refresh current blogs
     * @param state
     * @param action
     */
    clearCurrentPlaces(state) {
      state.briefPlaceListInformation = _createDefaultBriefPlace();
    },
  },
  extraReducers(builder) {
    builder.addCase(placesThunks.getPlacesAsync.pending, (state, action) => {
      state.briefPlaceListInformation.status.isFetching = true;
    });

    builder.addCase(placesThunks.getPlacesAsync.fulfilled, (state, action) => {
      if (!action.payload) return;

      const [type, places] = action.payload;

      if (!places || places.length === 0) return;

      if (state.briefPlaceListInformation.type === type) {
        state.briefPlaceListInformation.data =
          state.briefPlaceListInformation.data.concat(places);
        state.briefPlaceListInformation.skip += places.length;
        state.briefPlaceListInformation.status.isFetching = false;
      } else {
        state.briefPlaceListInformation = _createDefaultBriefPlace();
        state.briefPlaceListInformation.type = type;
        state.briefPlaceListInformation.data = places;
        state.briefPlaceListInformation.skip += places.length;
      }
    });

    builder.addCase(
      placesThunks.getPlaceDetailAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        let [placeId, place] = action.payload;

        state.placeDict[placeId] = place;
      }
    );

    builder.addCase(
      placesThunks.getPlaceTypesAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        state.types = state.types.concat(_DefaultTypes, action.payload);
      }
    );

    builder.addCase(
      placesThunks.favoritePlaceAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        // Update in list
        for (const place of state.briefPlaceListInformation.data) {
          if (place._id === action.payload) {
            place.isFavorited = true;
            place.totalFavorites! += 1;
          }
        }

        // Update in detail (if has)
        if (state.placeDict[action.payload]) {
          state.placeDict[action.payload].isFavorited = true;
          state.placeDict[action.payload].totalFavorites! += 1;
        }
      }
    );

    builder.addCase(
      placesThunks.unfavoritePlaceAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        // Update in list
        for (const place of state.briefPlaceListInformation.data) {
          if (place._id === action.payload) {
            place.isFavorited = false;
            place.totalFavorites! -= 1;
          }
        }

        // Update in detail (if has)
        if (state.placeDict[action.payload]) {
          state.placeDict[action.payload].isFavorited = false;
          state.placeDict[action.payload].totalFavorites! -= 1;
        }
      }
    );

    builder.addCase(placesThunks.visitPlaceAsync.fulfilled, (state, action) => {
      if (!action.payload) return;

      // Update in list
      for (const place of state.briefPlaceListInformation.data) {
        if (place._id === action.payload) {
          place.isVisited = true;
          place.totalVisits! += 1;
        }
      }

      // Update in detail (if has)
      if (state.placeDict[action.payload]) {
        state.placeDict[action.payload].isVisited = true;
        state.placeDict[action.payload].totalVisits! += 1;
      }
    });

    builder.addCase(
      placesThunks.unvisitPlaceAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        // Update in list
        for (const place of state.briefPlaceListInformation.data) {
          if (place._id === action.payload) {
            place.isVisited = false;
            place.totalVisits! -= 1;
          }
        }

        // Update in detail (if has)
        if (state.placeDict[action.payload]) {
          state.placeDict[action.payload].isVisited = false;
          state.placeDict[action.payload].totalVisits! -= 1;
        }
      }
    );
  },
});

export const placesActions = placesSlice.actions;
