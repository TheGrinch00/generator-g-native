import { RootState } from "@/src/redux-store";

export const getCounter = (state: RootState) => state?.counter;
export const getCount = (state: RootState) => state?.counter?.count ?? 0;
