import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppToast } from "./index.hooks";

export const AppToast = () => {
  const { open, message, config, accentColor, theme, translateY, opacity, close } =
    useAppToast();
  const insets = useSafeAreaInsets();

  if (!open && !message) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: insets.top + 8,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
      pointerEvents={open ? "auto" : "none"}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.card,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.border,
          borderLeftWidth: 4,
          borderLeftColor: accentColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Ionicons
          name={config.icon as any}
          size={24}
          color={accentColor}
        />
        <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: theme.foreground,
              marginBottom: 2,
            }}
          >
            {config.title}
          </Text>
          <Text
            style={{ fontSize: 13, color: theme.muted }}
            numberOfLines={3}
          >
            {message}
          </Text>
        </View>
        <Pressable onPress={close} hitSlop={8}>
          <Ionicons name="close" size={20} color={theme.mutedForeground} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

AppToast.displayName = "AppToast";
