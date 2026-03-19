import { RootState } from "@/src/redux-store";

export const getUi = (state: RootState) => state?.ui;
export const getIsLoading = (state: RootState) => state?.ui?.isLoading;
