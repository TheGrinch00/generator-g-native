export default ({ ScreenName, screenTitle, paramType, paramId }) => `import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

type Params = ${paramType};

const ${ScreenName}Screen = () => {
  const { ${paramId} } = useLocalSearchParams<Params>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>${screenTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ${ScreenName}Screen;
`;
