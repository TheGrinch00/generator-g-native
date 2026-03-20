import "../global.css";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { StoreProvider } from "@/src/redux-store/StoreProvider";
import { AppToast } from "@/src/components/AppToast";
import { themeVars } from "@/src/theme";
import "@/src/i18n";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <StoreProvider>
      <View style={themeVars[colorScheme ?? "light"]} className="flex-1">
        <SafeAreaProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false }} />
          <AppToast />
        </SafeAreaProvider>
      </View>
    </StoreProvider>
  );
}
