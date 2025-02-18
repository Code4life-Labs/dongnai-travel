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
  };
}

const _DefaultTypes = [
  {
    value: "all",
    name: "All",
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
    builder.addCase(placesThunks.getPlacesAsync.fulfilled, (state, action) => {
      if (!action.payload) return;

      const [type, places] = action.payload;

      if (!places) return;

      if (places.length !== 0) {
        state.briefPlaceListInformation.type = type;
        state.briefPlaceListInformation.data =
          state.briefPlaceListInformation.data.concat(places);
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
  },
});

export const placesActions = placesSlice.actions;
