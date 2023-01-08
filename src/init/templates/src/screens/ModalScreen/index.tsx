import { FC, memo } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useModalScreen } from "./index.hooks";

import { Text, View } from "components/Themed";
import EditScreenInfo from "components/EditScreenInfo";

type ModalScreenProps = {};

export const ModalScreen: FC<ModalScreenProps> = memo(() => {
  const { styles } = useModalScreen();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/ModalScreen.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
});

ModalScreen.displayName = "ModalScreen";
