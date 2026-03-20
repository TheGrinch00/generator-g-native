import { createSlice } from "@reduxjs/toolkit";
import * as extraActions from "../../extra-actions";
import * as selectors from "./counter.selectors";
import * as sagas from "./counter.sagas";
import { CounterState } from "./counter.interfaces";

const initialState: CounterState = {
  count: 0,
};

export const counterStore = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export { selectors, sagas };
