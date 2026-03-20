export default ({ ScreenName }) => `import { useThemeColors } from "@/src/theme";

export const use${ScreenName}Screen = () => {
  const theme = useThemeColors();

  return { theme };
};
`;
