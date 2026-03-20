export default ({ ScreenName, screenTitle }) => `import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ${ScreenName}Screen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text className="text-xl font-semibold">${screenTitle}</Text>
      </View>

      <View className="flex-1 px-6">
        {/* Screen content */}
      </View>
    </SafeAreaView>
  );
}
`;
