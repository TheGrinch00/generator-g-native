import { createSlice } from "@reduxjs/toolkit";
import * as selectors from "./ui.selectors";
import * as sagas from "./ui.sagas";
import { UiState } from "./ui.interfaces";

const initialState: UiState = {
  isLoading: false,
};

export const uiStore = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export { selectors, sagas };
