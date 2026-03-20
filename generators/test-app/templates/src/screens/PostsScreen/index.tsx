import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePostsScreen } from "./index.hooks";

export default function PostsScreen() {
  const { t, theme, posts, isLoading, error, fetchPosts } = usePostsScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.foreground} />
        </Pressable>
        <Text className="text-xl font-semibold text-foreground">
          {t("posts.title")}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.primary} />
          <Text className="text-base text-muted mt-4">{t("posts.loading")}</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cloud-offline" size={48} color={theme.destructive} />
          <Text className="text-base text-destructive mt-4">{t("posts.error")}</Text>
          <Pressable
            className="mt-4 bg-primary px-6 py-3 rounded-xl active:opacity-80"
            onPress={fetchPosts}
          >
            <Text className="text-primary-foreground font-semibold">{t("posts.retry")}</Text>
          </Pressable>
        </View>
      ) : posts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted">{t("posts.empty")}</Text>
        </View>
      ) : (
        <FlashList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View className="mx-4 mb-3 p-4 bg-card rounded-2xl border border-border">
              <Text className="text-base font-semibold text-foreground" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-sm text-muted mt-2" numberOfLines={3}>
                {item.body}
              </Text>
              <Text className="text-xs text-muted-foreground mt-3">
                {t("posts.byUser", { id: item.userId })}
              </Text>
            </View>
          )}
          contentContainerClassName="pt-2 pb-4"
        />
      )}
    </SafeAreaView>
  );
}
