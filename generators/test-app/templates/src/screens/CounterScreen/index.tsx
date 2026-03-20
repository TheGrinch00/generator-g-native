import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCounterScreen } from "./index.hooks";

export default function CounterScreen() {
  const { t, theme, count, increment, decrement, reset } = useCounterScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.foreground} />
        </Pressable>
        <Text className="text-xl font-semibold text-foreground">{t("counter.title")}</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="w-32 h-32 rounded-full bg-primary/10 items-center justify-center mb-8">
          <Text className="text-4xl font-bold text-primary">{count}</Text>
        </View>

        <Text className="text-lg text-muted mb-10">
          {t("counter.value", { count })}
        </Text>

        <View className="flex-row gap-4">
          <Pressable
            className="w-14 h-14 rounded-2xl bg-destructive/10 items-center justify-center border border-destructive/20 active:opacity-70"
            onPress={decrement}
          >
            <Ionicons name="remove" size={22} color={theme.destructive} />
          </Pressable>

          <Pressable
            className="w-14 h-14 rounded-2xl bg-card items-center justify-center border border-border active:opacity-70"
            onPress={reset}
          >
            <Ionicons name="refresh" size={20} color={theme.muted} />
          </Pressable>

          <Pressable
            className="w-14 h-14 rounded-2xl bg-success/10 items-center justify-center border border-success/20 active:opacity-70"
            onPress={increment}
          >
            <Ionicons name="add" size={22} color={theme.success} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
