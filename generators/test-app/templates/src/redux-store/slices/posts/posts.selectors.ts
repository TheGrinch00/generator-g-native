import { RootState } from "@/src/redux-store";

export const getPosts = (state: RootState) => state?.posts;
export const getPostItems = (state: RootState) => state?.posts?.items ?? [];
export const getPostsError = (state: RootState) => state?.posts?.error ?? null;
export const getPostCount = (state: RootState) => state?.posts?.items?.length ?? 0;
