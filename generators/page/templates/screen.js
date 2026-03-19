export default ({ ScreenName, screenTitle }) => `import { View, Text, StyleSheet } from "react-native";

const ${ScreenName}Screen = () => {
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
