import { createSlice } from "@reduxjs/toolkit";

// Import utils
import { ArrayUtils } from "@/utils/array";
import { BooleanUtils } from "@/utils/boolean";
import { NumberUtils } from "@/utils/number";

// Import types
import type { Place } from "@/objects/place/type";

import { placesThunks } from "./middlewares";

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
  };
}

export const placesSlice = createSlice({
  name: "places",
  initialState: {
    detailsOfPlaces: new Map<string, Partial<Place>>(),
    currentPlaces: _createDefaultBriefPlace(),
  },
  reducers: {
    /**
     * Use to add a places details to Map (for caching)
     * @param state
     * @param action
     */
    addPlaceDetails(state, action) {
      const placeDetails = action.payload as Place;
      if (!state.detailsOfPlaces.get(placeDetails._id))
        state.detailsOfPlaces.set(placeDetails._id, placeDetails);
    },

    /**
     * Use to update an existing place's details with `id`
     * @param state
     * @param action
     */
    updatePlaceDetails(state, action) {
      const { id, placeDetails } = action.payload as {
        id: string;
        placeDetails: Place;
      };

      state.detailsOfPlaces.set(id, placeDetails);
    },

    /**
     * Use to clear a place details by id
     * @param state
     * @param action
     */
    clearPlaceDetails(state, action) {
      let placeId = action.payload;
      if (state.detailsOfPlaces.get(placeId))
        state.detailsOfPlaces.delete(placeId);
    },

    /**
     * Use to update a brief place (for caching)
     * @param state
     * @param action
     */
    updateBriefPlace(state, action) {
      let { placeIndex, updateData } = action.payload;
      if (BooleanUtils.isEmpty(placeIndex)) return;

      let place = state.currentPlaces.data![placeIndex];
      if (place) {
        state.currentPlaces.data = ArrayUtils.updateAt(
          state.currentPlaces.data!,
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
    increaseSkipBriefPlacesAmount(state) {
      state.currentPlaces.skip += state.currentPlaces.skip;
    },

    /**
     * Use to decrease amount of skip, prevent the value lower than 0
     * @param state
     * @param action
     */
    decreaseSkipBriefPlacesAmount(state) {
      state.currentPlaces.skip = NumberUtils.decreaseByAmount(
        state.currentPlaces.skip,
        state.currentPlaces.limit
      );
    },

    /**
     * Use to refresh current blogs
     * @param state
     * @param action
     */
    clearCurrentPlaces(state) {
      state.currentPlaces = _createDefaultBriefPlace();
    },
  },
  extraReducers(builder) {
    builder.addCase(
      placesThunks.getPlacesByTypeAsync.fulfilled,
      (state, action) => {
        if (!action.payload) return;

        const [type, places] = action.payload;

        if (!places) return;

        if (places.length !== 0) {
          state.currentPlaces.type = type;
          state.currentPlaces.data = state.currentPlaces.data.concat(places);
          state.currentPlaces.skip += places.length;
        }
      }
    );

    // builder.addCase(
    //   placesThunks.getPlaceDetailsByIdAsync.fulfilled,
    //   (state, action) => {
    //     let [placeId, placeDetails] = action.payload;

    //     state.detailsOfPlaces.set(placeId, placeDetails);
    //   }
    // );
  },
});

export const placesActions = placesSlice.actions;
