import { useColorScheme } from "nativewind";
import { colors } from "./colors";

/**
 * Returns the color tokens for the current color scheme.
 * Use this hook when you need raw hex values in JS (e.g. Switch trackColor, icon color props).
 * For className usage, prefer semantic Tailwind classes instead.
 */
export const useThemeColors = () => {
  const { colorScheme } = useColorScheme();
  return colors[colorScheme === "dark" ? "dark" : "light"];
};
