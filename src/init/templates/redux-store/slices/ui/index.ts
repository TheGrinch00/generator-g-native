import { createSlice } from "@reduxjs/toolkit";
import * as selectors from "./ui.selectors";
import { SetDialogOpenAction, UiState } from "./ui.interfaces";
import * as extraActions from "../../extra-actions";
import * as sagas from "./ui.sagas";

const initialState: UiState = {
  isDialogOpen: {},
};

export const uiStore = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDialogOpen: (state, action: SetDialogOpenAction) => {
      state.isDialogOpen = {
        ...(state.isDialogOpen ?? initialState.isDialogOpen),
        [action.payload.dialogType]: action.payload.open,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(extraActions.appStartup, (state, action) => {
      state.isDialogOpen = {
        ...initialState.isDialogOpen,
      };
    });
  },
});

export { selectors, sagas };
