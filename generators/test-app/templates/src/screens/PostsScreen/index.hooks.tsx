import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";
import { useAppDispatch, useAppSelector } from "@/src/redux-store/hooks";
import { actions, selectors } from "@/src/redux-store/slices";

export const usePostsScreen = () => {
  const { t } = useTranslation();
  const theme = useThemeColors();
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectors.getPostItems);
  const isLoading = useAppSelector(selectors.getAjaxIsLoadingByApi(actions.getPosts.api));
  const error = useAppSelector(selectors.getPostsError);

  const fetchPosts = () => {
    dispatch(actions.getPosts.request({}));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { t, theme, posts, isLoading, error, fetchPosts };
};
