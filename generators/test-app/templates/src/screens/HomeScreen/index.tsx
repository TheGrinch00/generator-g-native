import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHomeScreen } from "./index.hooks";

export default function HomeScreen() {
  const { t, theme, navigateTo } = useHomeScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-8 pb-6">
        <Text className="text-3xl font-bold tracking-tight text-foreground">
          {t("home.title")}
        </Text>
        <Text className="text-base text-muted mt-1">
          {t("home.subtitle")}
        </Text>

        <View className="mt-8 gap-3">
          <NavCard
            icon={<Ionicons name="keypad" size={22} color={theme.primary} />}
            title={t("home.counterCard")}
            description={t("home.counterDescription")}
            onPress={() => navigateTo("/counter")}
            chevronColor={theme.border}
          />
          <NavCard
            icon={<Ionicons name="mail" size={22} color={theme.secondary} />}
            title={t("home.formCard")}
            description={t("home.formDescription")}
            onPress={() => navigateTo("/contact")}
            chevronColor={theme.border}
          />
          <NavCard
            icon={<Ionicons name="person" size={22} color={theme.accent} />}
            title={t("home.profileCard")}
            description={t("home.profileDescription")}
            onPress={() => navigateTo("/profile/demo-user")}
            chevronColor={theme.border}
          />
          <NavCard
            icon={<Ionicons name="cloud-download" size={22} color={theme.success} />}
            title={t("home.postsCard")}
            description={t("home.postsDescription")}
            onPress={() => navigateTo("/posts")}
            chevronColor={theme.border}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NavCard({
  icon,
  title,
  description,
  onPress,
  chevronColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  chevronColor: string;
}) {
  return (
    <Pressable
      className="flex-row items-center bg-card rounded-2xl p-4 border border-border active:opacity-80"
      onPress={onPress}
    >
      <View className="w-11 h-11 rounded-xl bg-background items-center justify-center border border-border">
        {icon}
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        <Text className="text-sm text-muted mt-0.5">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={chevronColor} />
    </Pressable>
  );
}
