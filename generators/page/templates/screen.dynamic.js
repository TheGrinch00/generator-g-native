export default ({ ScreenName, screenTitle, paramType, paramId }) => `import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

type Params = ${paramType};

export default function ${ScreenName}Screen() {
  const { ${paramId} } = useLocalSearchParams<Params>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={24} color="#000" />
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
