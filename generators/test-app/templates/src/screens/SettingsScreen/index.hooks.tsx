import { useState } from "react";
import { colorScheme, useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";

export const useSettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const { colorScheme: currentScheme } = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const theme = useThemeColors();

  const isDarkMode = currentScheme === "dark";

  const toggleDarkMode = () => {
    colorScheme.set(isDarkMode ? "light" : "dark");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "it" : "en");
  };

  const currentLanguage = i18n.language.toUpperCase();

  return {
    t,
    theme,
    currentLanguage,
    toggleLanguage,
    isDarkMode,
    toggleDarkMode,
    notifications,
    setNotifications,
  };
};
