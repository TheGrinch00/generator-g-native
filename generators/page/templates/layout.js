export default ({ ScreenName, screenTitle }) => `import { Stack } from "expo-router";

const ${ScreenName}Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: "${screenTitle}",
      }}
    />
  );
};

export default ${ScreenName}Layout;
`;
