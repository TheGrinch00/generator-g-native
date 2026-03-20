export default ({ ScreenName, screenTitle }) => `import { Stack } from "expo-router";

export default function ${ScreenName}Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
`;
