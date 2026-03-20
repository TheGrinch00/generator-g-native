import { createSlice } from "@reduxjs/toolkit";
import * as extraActions from "../../extra-actions";
import * as selectors from "./posts.selectors";
import * as sagas from "./posts.sagas";
import { PostsState } from "./posts.interfaces";

const initialState: PostsState = {
  items: [],
  error: null,
};

export const postsStore = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(extraActions.getPosts.request, (state) => {
        state.error = null;
      })
      .addCase(extraActions.getPosts.success, (state, action: any) => {
        state.items = action.payload.data;
        state.error = null;
      })
      .addCase(extraActions.getPosts.fail, (state, action: any) => {
        state.error = action.payload.message;
      });
  },
});

export { selectors, sagas };
