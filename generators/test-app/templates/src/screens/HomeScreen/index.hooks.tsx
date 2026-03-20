import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";

export const useHomeScreen = () => {
  const { t } = useTranslation();
  const theme = useThemeColors();

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  return { t, theme, navigateTo };
};
