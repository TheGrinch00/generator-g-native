import { RootState } from "redux-store";

export const getIsDialogOpen = (state: RootState) => state?.ui?.isDialogOpen;
