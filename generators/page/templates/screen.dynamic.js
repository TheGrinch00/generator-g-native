export default ({ ScreenName, screenTitle, paramType, paramId }) => `import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/src/theme";

type Params = ${paramType};

export default function ${ScreenName}Screen() {
  const { ${paramId} } = useLocalSearchParams<Params>();
  const theme = useThemeColors();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.foreground} />
        </Pressable>
        <Text className="text-xl font-semibold text-foreground">${screenTitle}</Text>
      </View>

      <View className="flex-1 px-6">
        {/* Screen content */}
      </View>
    </SafeAreaView>
  );
}
`;
