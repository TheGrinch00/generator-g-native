import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";

export const useProfileScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useThemeColors();

  return { t, theme, id };
};
