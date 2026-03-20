import { RootState } from "@/src/redux-store";

export const getAjaxIsLoadingByApi = (api: string) => (state: RootState) =>
  state?.ajax?.isLoading[api];
