export default ({ ScreenName, paramType, paramId }) => `import { useLocalSearchParams } from "expo-router";
import { useThemeColors } from "@/src/theme";

type Params = ${paramType};

export const use${ScreenName}Screen = () => {
  const { ${paramId} } = useLocalSearchParams<Params>();
  const theme = useThemeColors();

  return { ${paramId}, theme };
};
`;
