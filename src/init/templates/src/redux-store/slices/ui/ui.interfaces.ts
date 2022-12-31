import { Action } from "redux";

export enum DialogTypes {}

export interface UiState {
  isDialogOpen: {};
}

export interface SetDialogOpenAction extends Action {
  payload: {
    dialogType: DialogTypes;
    open: boolean;
  };
}
