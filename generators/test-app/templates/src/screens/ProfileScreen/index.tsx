import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useProfileScreen } from "./index.hooks";

export default function ProfileScreen() {
  const { t, theme, id } = useProfileScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.foreground} />
        </Pressable>
        <Text className="text-xl font-semibold text-foreground">{t("profile.title")}</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 rounded-full bg-accent/10 items-center justify-center mb-6">
          <Ionicons name="person" size={40} color={theme.accent} />
        </View>
        <Text className="text-2xl font-bold text-foreground">
          {t("profile.greeting", { name: id })}
        </Text>
        <Text className="text-base text-muted mt-2">
          ID: {id}
        </Text>
      </View>
    </SafeAreaView>
  );
}
