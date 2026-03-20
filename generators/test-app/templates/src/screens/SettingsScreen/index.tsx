import { View, Text, Pressable, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSettingsScreen } from "./index.hooks";

export default function SettingsScreen() {
  const {
    t,
    theme,
    currentLanguage,
    toggleLanguage,
    isDarkMode,
    toggleDarkMode,
    notifications,
    setNotifications,
  } = useSettingsScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-3xl font-bold tracking-tight text-foreground">
          {t("settings.title")}
        </Text>

        <View className="mt-8 gap-1">
          <SettingRow
            icon={<Ionicons name="globe" size={20} color={theme.primary} />}
            label={t("settings.language")}
            right={
              <Pressable
                onPress={toggleLanguage}
                className="bg-primary/10 px-3 py-1.5 rounded-lg active:bg-primary/20"
              >
                <Text className="text-primary font-semibold text-sm">
                  {currentLanguage}
                </Text>
              </Pressable>
            }
          />
          <SettingRow
            icon={<Ionicons name="moon" size={20} color={theme.secondary} />}
            label={t("settings.darkMode")}
            right={
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: theme.switchTrack, true: theme.switchTrackActive }}
                thumbColor={Platform.OS === "android" ? theme.switchThumb : undefined}
                ios_backgroundColor={theme.switchTrack}
              />
            }
          />
          <SettingRow
            icon={<Ionicons name="notifications" size={20} color={theme.accent} />}
            label={t("settings.notifications")}
            description={t("settings.notificationsDescription")}
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: theme.switchTrack, true: theme.switchTrackActive }}
                thumbColor={Platform.OS === "android" ? theme.switchThumb : undefined}
                ios_backgroundColor={theme.switchTrack}
              />
            }
          />
          <SettingRow
            icon={<Ionicons name="information-circle" size={20} color={theme.muted} />}
            label={t("settings.version")}
            right={
              <Text className="text-sm text-muted-foreground">1.0.0</Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  description,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between py-4 border-b border-border">
      <View className="flex-row items-center flex-1 mr-3">
        {icon}
        <View className="ml-3">
          <Text className="text-base text-foreground">{label}</Text>
          {description && (
            <Text className="text-xs text-muted-foreground mt-0.5">{description}</Text>
          )}
        </View>
      </View>
      {right}
    </View>
  );
}
