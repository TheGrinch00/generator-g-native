import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";

export const useTabsLayout = () => {
  const { t } = useTranslation();
  const theme = useThemeColors();

  return { t, theme };
};
