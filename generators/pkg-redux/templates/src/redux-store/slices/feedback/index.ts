import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackState, FeedbackType } from "./feedback.interfaces";
import * as selectors from "./feedback.selectors";
import * as sagas from "./feedback.sagas";

export const feedbackStore = createSlice({
  name: "feedback",
  initialState: {
    open: false,
    type: "info",
    message: "",
  } as FeedbackState,
  reducers: {
    setFeedback: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: FeedbackType;
        message?: string;
      }>,
    ) => {
      state.open = true;
      state.type = payload.type ?? "info";
      state.message = payload.message ?? state.message;
    },
    closeFeedback: (state) => {
      state.open = false;
    },
  },
});

export { selectors, sagas };
