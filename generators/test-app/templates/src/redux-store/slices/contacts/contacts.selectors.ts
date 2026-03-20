import { RootState } from "@/src/redux-store";

export const getContacts = (state: RootState) => state?.contacts;
export const getContactItems = (state: RootState) => state?.contacts?.items ?? [];
export const getContactCount = (state: RootState) => state?.contacts?.items?.length ?? 0;
