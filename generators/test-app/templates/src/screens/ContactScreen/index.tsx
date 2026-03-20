import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContactScreen } from "./index.hooks";

export default function ContactScreen() {
  const { t, theme, form } = useContactScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3 gap-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={theme.foreground} />
        </Pressable>
        <Text className="text-xl font-semibold text-foreground">{t("contact.title")}</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4 mt-4">
          <form.AppField
            name="firstName"
            children={(field) => (
              <field.FormTextField
                label={t("contact.firstName")}
                placeholder={t("contact.firstNamePlaceholder")}
              />
            )}
          />

          <form.AppField
            name="lastName"
            children={(field) => (
              <field.FormTextField
                label={t("contact.lastName")}
                placeholder={t("contact.lastNamePlaceholder")}
              />
            )}
          />

          <form.AppField
            name="email"
            children={(field) => (
              <field.FormTextField
                label={t("contact.email")}
                placeholder={t("contact.emailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <form.AppField
            name="phone"
            children={(field) => (
              <field.FormTextField
                label={t("contact.phone")}
                placeholder={t("contact.phonePlaceholder")}
                keyboardType="phone-pad"
              />
            )}
          />

          <form.AppField
            name="category"
            children={(field) => (
              <field.FormSelect
                label={t("contact.category")}
                placeholder={t("contact.category")}
                options={[
                  { value: "personal", label: "Personal" },
                  { value: "work", label: "Work" },
                  { value: "family", label: "Family" },
                  { value: "other", label: "Other" },
                ]}
              />
            )}
          />

          <form.AppField
            name="newsletter"
            children={(field) => (
              <field.FormSwitch
                label={t("contact.newsletter")}
                description={t("contact.newsletterDescription")}
              />
            )}
          />
        </View>

        <Pressable
          className="bg-primary rounded-xl py-4 items-center mt-8 active:opacity-80"
          onPress={() => form.handleSubmit()}
        >
          <Text className="text-primary-foreground text-base font-semibold">
            {t("contact.submit")}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
