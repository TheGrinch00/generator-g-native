import * as ajax from "./ajax";
import * as ui from "./ui";

export const reducers = {
  ui: ui.uiStore.reducer,
  ajax: ajax.ajaxStore.reducer,
};

export const actions = {
  ...ui.uiStore.actions,
  ...ajax.ajaxStore.actions,
};

export const selectors = {
  ...ui.selectors,
  ...ajax.selectors,
};

export const sagas = [
    ...Object.values(ui.sagas),
    ...Object.values(ajax.sagas),
];
