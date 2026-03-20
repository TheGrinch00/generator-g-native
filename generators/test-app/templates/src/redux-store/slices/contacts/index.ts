import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as extraActions from "../../extra-actions";
import * as selectors from "./contacts.selectors";
import * as sagas from "./contacts.sagas";
import { ContactsState, Contact } from "./contacts.interfaces";

const initialState: ContactsState = {
  items: [],
};

export const contactsStore = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Contact>) => {
      state.items.push(action.payload);
    },
    removeContact: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    clearContacts: (state) => {
      state.items = [];
    },
  },
});

export { selectors, sagas };
