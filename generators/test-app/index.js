import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";

const __dirname = dirname(fileURLToPath(import.meta.url));

function dirname(p) {
  return path.dirname(p);
}

function sibling(generatorName) {
  return path.resolve(__dirname, "..", generatorName, "templates");
}

export default class TestAppGenerator extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Welcome to ${chalk.blue(
          "GeNYG Native Test App",
        )} generator! This will scaffold a ${chalk.red(
          "full demo app",
        )} with pages, forms, Redux, and translations.`,
      ),
    );

    const { accept } = await this.prompt([
      {
        type: "confirm",
        name: "accept",
        message:
          "This will run all pkg generators and create demo screens. Proceed?",
        default: true,
      },
    ]);

    if (!accept) {
      this.abort = true;
    }
  }

  writing() {
    if (this.abort) return;

    this._writePkgCore();
    this._writePkgUi();
    this._writePkgRedux();
    this._writePkgTranslations();
    this._writeTestAppScreens();
  }

  async install() {
    if (this.abort) return;

    const run = (cmd, args) =>
      new Promise((resolve, reject) => {
        const child = this.spawnCommand(cmd, args, { stdio: "inherit" });
        child.on("exit", (code) =>
          code === 0 ? resolve() : reject(new Error(`${cmd} exited with ${code}`)),
        );
        child.on("error", reject);
      });

    try {
      // All expo-managed packages in one call
      await run("npx", [
        "expo", "install",
        "expo-router",
        "expo-linking",
        "expo-constants",
        "expo-localization",
        "react-native-screens",
        "react-native-safe-area-context",
        "react-native-gesture-handler",
        "react-native-reanimated",
        "react-native-worklets",
        "react-dom",
        "@expo/metro-runtime",
        "@react-native-async-storage/async-storage",
        "@expo/vector-icons",
        "@shopify/flash-list",
      ]);
    } catch (err) {
      this.log("\n❌ Dependencies installation failed:", err?.message || err);
      throw err;
    }
  }

  // ─── pkg-core (inline) ────────────────────────────────────

  _writePkgCore() {
    this.packageJson.merge({
      main: "expo-router/entry",
      scripts: {
        lint: "eslint .",
        tsc: "tsc --noEmit",
        test: "jest --runInBand",
      },
      devDependencies: {
        "@types/jest": "^29.5.0",
        "eslint-config-prettier": "^9.1.0",
        husky: "^9.1.0",
        jest: "^29.7.0",
        "lint-staged": "^15.2.0",
        prettier: "^3.6.0",
        "ts-jest": "^29.2.0",
      },
      dependencies: {
        zod: "^3.24.0",
        "@tanstack/react-query": "^5.85.0",
        axios: "^1.12.0",
      },
    });

    // Update app.json
    const appJsonPath = this.destinationPath("app.json");
    if (fs.existsSync(appJsonPath)) {
      const appJson = this.fs.readJSON(appJsonPath);
      appJson.expo = appJson.expo || {};
      appJson.expo.scheme = appJson.expo.scheme || appJson.expo.slug || "app";
      appJson.expo.userInterfaceStyle = "automatic";
      appJson.expo.plugins = appJson.expo.plugins || [];
      if (!appJson.expo.plugins.includes("expo-router")) {
        appJson.expo.plugins.push("expo-router");
      }
      appJson.expo.web = appJson.expo.web || {};
      appJson.expo.web.bundler = "metro";
      this.fs.writeJSON(appJsonPath, appJson);
    }

    // Remove old entry points
    for (const file of ["index.ts", "index.js", "App.tsx", "App.js"]) {
      const filePath = this.destinationPath(file);
      if (fs.existsSync(filePath)) {
        this.fs.delete(filePath);
      }
    }

    // Update tsconfig.json with path aliases
    const tsconfigPath = this.destinationPath("tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = this.fs.readJSON(tsconfigPath);
      tsconfig.compilerOptions = tsconfig.compilerOptions || {};
      tsconfig.compilerOptions.baseUrl = ".";
      tsconfig.compilerOptions.paths = {
        "@/*": ["./*"],
      };
      this.fs.writeJSON(tsconfigPath, tsconfig);
    }

    // .npmrc
    this.fs.write(this.destinationPath(".npmrc"), "legacy-peer-deps=true\n");

    // Copy dotfiles from pkg-core templates
    this.fs.copy(path.join(sibling("pkg-core"), ".*"), this.destinationRoot());

    // Create src directories
    const dirs = [
      "src/components",
      "src/models",
      "src/lib",
      "src/hooks",
      "src/constants",
      "src/services",
    ];
    for (const dir of dirs) {
      this.fs.write(this.destinationPath(`${dir}/.gitkeep`), "");
    }
  }

  // ─── pkg-ui (inline) ──────────────────────────────────────

  _writePkgUi() {
    this.packageJson.merge({
      dependencies: {
        nativewind: "^4.1.0",
        "@tanstack/react-form": "^1.11.0",
      },
      devDependencies: {
        tailwindcss: "^3.4.0",
        "babel-preset-expo": "~55.0.8",
      },
    });

    // Copy all pkg-ui templates (non-dotfiles)
    this.fs.copy(path.join(sibling("pkg-ui"), "**"), this.destinationPath("."));

    // global.css with theme CSS variables (light defaults)
    this.fs.write(
      this.destinationPath("global.css"),
      `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 37 99 235;
    --color-primary-foreground: 255 255 255;
    --color-secondary: 139 92 246;
    --color-accent: 245 158 11;
    --color-destructive: 239 68 68;
    --color-success: 34 197 94;
    --color-background: 255 255 255;
    --color-foreground: 17 24 39;
    --color-muted: 107 114 128;
    --color-muted-foreground: 156 163 175;
    --color-border: 229 231 235;
    --color-input: 249 250 251;
    --color-card: 249 250 251;
  }
}
`,
    );

    // Override theme index to include vars export
    this.fs.write(
      this.destinationPath("src/theme/index.ts"),
      `export { colors } from "./colors";
export { useThemeColors } from "./useThemeColors";
export { themeVars } from "./vars";
`,
    );

    // NativeWind vars() for runtime dark mode switching
    this.fs.write(
      this.destinationPath("src/theme/vars.ts"),
      `import { vars } from "nativewind";

export const themeVars = {
  light: vars({
    "--color-primary": "37 99 235",
    "--color-primary-foreground": "255 255 255",
    "--color-secondary": "139 92 246",
    "--color-accent": "245 158 11",
    "--color-destructive": "239 68 68",
    "--color-success": "34 197 94",
    "--color-background": "255 255 255",
    "--color-foreground": "17 24 39",
    "--color-muted": "107 114 128",
    "--color-muted-foreground": "156 163 175",
    "--color-border": "229 231 235",
    "--color-input": "249 250 251",
    "--color-card": "249 250 251",
  }),
  dark: vars({
    "--color-primary": "59 130 246",
    "--color-primary-foreground": "255 255 255",
    "--color-secondary": "167 139 250",
    "--color-accent": "251 191 36",
    "--color-destructive": "248 113 113",
    "--color-success": "74 222 128",
    "--color-background": "15 23 42",
    "--color-foreground": "248 250 252",
    "--color-muted": "148 163 184",
    "--color-muted-foreground": "100 116 139",
    "--color-border": "30 41 59",
    "--color-input": "30 41 59",
    "--color-card": "30 41 59",
  }),
};
`,
    );
  }

  // ─── pkg-redux (inline) ───────────────────────────────────

  _writePkgRedux() {
    this.packageJson.merge({
      dependencies: {
        "@reduxjs/toolkit": "^2.9.0",
        "react-redux": "^9.2.0",
        "redux-persist": "^6.0.0",
        "redux-saga": "^1.3.0",
      },
    });

    // Copy redux store templates
    this.fs.copy(
      path.join(sibling("pkg-redux"), "**"),
      this.destinationPath("."),
    );
  }

  // ─── pkg-translations (inline) ────────────────────────────

  _writePkgTranslations() {
    this.packageJson.merge({
      dependencies: {
        i18next: "^24.2.0",
        "react-i18next": "^15.4.0",
      },
    });

    // Copy i18n template (will be overwritten by test app translations below)
    this.fs.copy(
      path.join(sibling("pkg-translations"), "**"),
      this.destinationPath("."),
    );
  }

  // ─── Test App Screens & Demo Content ──────────────────────

  _writeTestAppScreens() {
    // .genyg.json with all packages enabled
    this.fs.writeJSON(this.destinationPath(".genyg.json"), {
      packages: {
        core: true,
        ui: true,
        redux: true,
        translations: true,
      },
    });

    this._writeTranslations();
    this._writeRootLayout();
    this._writeTabsLayout();
    this._writeHomeScreen();
    this._writeSettingsScreen();
    this._writeProfileScreen();
    this._writeContactFormScreen();
    this._writeCounterScreen();
    this._writeCounterSlice();
    this._writeContactsSlice();
    this._writeSlicesIndex();
    this._writeContactModel();
  }

  // ─── Translations ──────────────────────────────────────────

  _writeTranslations() {
    this.fs.writeJSON(this.destinationPath("src/i18n/locales/en.json"), {
      common: {
        loading: "Loading...",
        error: "An error occurred",
        retry: "Try again",
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",
        delete: "Delete",
        edit: "Edit",
        back: "Back",
      },
      tabs: {
        home: "Home",
        settings: "Settings",
      },
      home: {
        title: "Home",
        subtitle: "Welcome to the demo app",
        counterCard: "Counter Demo",
        counterDescription: "Test Redux actions & selectors",
        formCard: "Contact Form",
        formDescription: "Test TanStack Form inputs",
        profileCard: "Profile",
        profileDescription: "Dynamic route example",
      },
      settings: {
        title: "Settings",
        language: "Language",
        darkMode: "Dark Mode",
        notifications: "Notifications",
        notificationsDescription: "Receive push notifications",
        version: "Version",
      },
      counter: {
        title: "Counter",
        value: "Value: {{count}}",
        increment: "Increment",
        decrement: "Decrement",
        reset: "Reset",
      },
      contact: {
        title: "New Contact",
        firstName: "First Name",
        firstNamePlaceholder: "Enter first name",
        lastName: "Last Name",
        lastNamePlaceholder: "Enter last name",
        email: "Email",
        emailPlaceholder: "name@example.com",
        phone: "Phone",
        phonePlaceholder: "+1 (555) 000-0000",
        category: "Category",
        newsletter: "Subscribe to newsletter",
        newsletterDescription: "Receive updates via email",
        submit: "Save Contact",
        success: "Contact saved!",
      },
      profile: {
        title: "Profile",
        greeting: "Hello, {{name}}!",
      },
    });

    this.fs.writeJSON(this.destinationPath("src/i18n/locales/it.json"), {
      common: {
        loading: "Caricamento...",
        error: "Si è verificato un errore",
        retry: "Riprova",
        save: "Salva",
        cancel: "Annulla",
        confirm: "Conferma",
        delete: "Elimina",
        edit: "Modifica",
        back: "Indietro",
      },
      tabs: {
        home: "Home",
        settings: "Impostazioni",
      },
      home: {
        title: "Home",
        subtitle: "Benvenuto nella demo app",
        counterCard: "Demo Contatore",
        counterDescription: "Testa azioni e selettori Redux",
        formCard: "Form Contatto",
        formDescription: "Testa gli input di TanStack Form",
        profileCard: "Profilo",
        profileDescription: "Esempio di rotta dinamica",
      },
      settings: {
        title: "Impostazioni",
        language: "Lingua",
        darkMode: "Modalità Scura",
        notifications: "Notifiche",
        notificationsDescription: "Ricevi notifiche push",
        version: "Versione",
      },
      counter: {
        title: "Contatore",
        value: "Valore: {{count}}",
        increment: "Incrementa",
        decrement: "Decrementa",
        reset: "Resetta",
      },
      contact: {
        title: "Nuovo Contatto",
        firstName: "Nome",
        firstNamePlaceholder: "Inserisci il nome",
        lastName: "Cognome",
        lastNamePlaceholder: "Inserisci il cognome",
        email: "Email",
        emailPlaceholder: "nome@esempio.com",
        phone: "Telefono",
        phonePlaceholder: "+39 333 000 0000",
        category: "Categoria",
        newsletter: "Iscriviti alla newsletter",
        newsletterDescription: "Ricevi aggiornamenti via email",
        submit: "Salva Contatto",
        success: "Contatto salvato!",
      },
      profile: {
        title: "Profilo",
        greeting: "Ciao, {{name}}!",
      },
    });
  }

  // ─── Root Layout ──────────────────────────────────────────

  _writeRootLayout() {
    this.fs.write(
      this.destinationPath("app/_layout.tsx"),
      `import "../global.css";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { StoreProvider } from "@/src/redux-store/StoreProvider";
import { themeVars } from "@/src/theme";
import "@/src/i18n";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <StoreProvider>
      <View style={themeVars[colorScheme ?? "light"]} className="flex-1">
        <SafeAreaProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </View>
    </StoreProvider>
  );
}
`,
    );
  }

  // ─── Tabs Layout ──────────────────────────────────────────

  _writeTabsLayout() {
    this.fs.write(
      this.destinationPath("app/(tabs)/_layout.tsx"),
      `import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/theme";

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
`,
    );
  }

  // ─── Home Screen ──────────────────────────────────────────

  _writeHomeScreen() {
    this.fs.write(
      this.destinationPath("app/(tabs)/index.tsx"),
      `import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/src/theme";

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useThemeColors();

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
            onPress={() => router.push("/counter")}
          />
          <NavCard
            icon={<Ionicons name="mail" size={22} color={theme.secondary} />}
            title={t("home.formCard")}
            description={t("home.formDescription")}
            onPress={() => router.push("/contact")}
          />
          <NavCard
            icon={<Ionicons name="person" size={22} color={theme.accent} />}
            title={t("home.profileCard")}
            description={t("home.profileDescription")}
            onPress={() => router.push("/profile/demo-user")}
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}) {
  const theme = useThemeColors();

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
      <Ionicons name="chevron-forward" size={20} color={theme.border} />
    </Pressable>
  );
}
`,
    );
  }

  // ─── Settings Screen ──────────────────────────────────────

  _writeSettingsScreen() {
    this.fs.write(
      this.destinationPath("app/(tabs)/settings.tsx"),
      `import { View, Text, Pressable, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colorScheme, useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/src/theme";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colorScheme: currentScheme } = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const theme = useThemeColors();

  const toggleDarkMode = () => {
    colorScheme.set(currentScheme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "it" : "en");
  };

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
                  {i18n.language.toUpperCase()}
                </Text>
              </Pressable>
            }
          />
          <SettingRow
            icon={<Ionicons name="moon" size={20} color={theme.secondary} />}
            label={t("settings.darkMode")}
            right={
              <Switch
                value={currentScheme === "dark"}
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
`,
    );
  }

  // ─── Profile (dynamic route) ──────────────────────────────

  _writeProfileScreen() {
    this.fs.write(
      this.destinationPath("app/profile/[id].tsx"),
      `import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/src/theme";

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useThemeColors();

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
`,
    );
  }

  // ─── Contact Form Screen ──────────────────────────────────

  _writeContactFormScreen() {
    this.fs.write(
      this.destinationPath("app/contact/index.tsx"),
      `import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/src/theme";
import { useContactForm } from "./index.hooks";

export default function ContactScreen() {
  const { t } = useTranslation();
  const { form } = useContactForm();
  const theme = useThemeColors();

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
`,
    );

    this.fs.write(
      this.destinationPath("app/contact/index.hooks.ts"),
      `import { z } from "zod";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppForm } from "@/src/components/_form";
import { useAppDispatch } from "@/src/redux-store/hooks";
import { actions } from "@/src/redux-store/slices";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  newsletter: z.boolean(),
});

export const useContactForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      category: "",
      newsletter: false,
    } as z.infer<typeof schema>,
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      dispatch(
        actions.addContact({
          id: Date.now().toString(),
          ...value,
        }),
      );
      Alert.alert(t("contact.success"));
    },
  });

  return { form };
};
`,
    );
  }

  // ─── Counter Screen ───────────────────────────────────────

  _writeCounterScreen() {
    this.fs.write(
      this.destinationPath("app/counter/index.tsx"),
      `import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColors } from "@/src/theme";
import { useAppDispatch, useAppSelector } from "@/src/redux-store/hooks";
import { actions, selectors } from "@/src/redux-store/slices";

export default function CounterScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectors.getCount);
  const theme = useThemeColors();

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
            onPress={() => dispatch(actions.decrement())}
          >
            <Ionicons name="remove" size={22} color={theme.destructive} />
          </Pressable>

          <Pressable
            className="w-14 h-14 rounded-2xl bg-card items-center justify-center border border-border active:opacity-70"
            onPress={() => dispatch(actions.reset())}
          >
            <Ionicons name="refresh" size={20} color={theme.muted} />
          </Pressable>

          <Pressable
            className="w-14 h-14 rounded-2xl bg-success/10 items-center justify-center border border-success/20 active:opacity-70"
            onPress={() => dispatch(actions.increment())}
          >
            <Ionicons name="add" size={22} color={theme.success} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
`,
    );
  }

  // ─── Counter Slice ────────────────────────────────────────

  _writeCounterSlice() {
    const d = "src/redux-store/slices/counter";

    this.fs.write(
      this.destinationPath(`${d}/index.ts`),
      `import { createSlice } from "@reduxjs/toolkit";
import * as selectors from "./counter.selectors";
import * as sagas from "./counter.sagas";
import { CounterState } from "./counter.interfaces";

const initialState: CounterState = {
  count: 0,
};

export const counterStore = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export { selectors, sagas };
`,
    );

    this.fs.write(
      this.destinationPath(`${d}/counter.interfaces.ts`),
      `export interface CounterState {
  count: number;
}
`,
    );

    this.fs.write(
      this.destinationPath(`${d}/counter.selectors.ts`),
      `import { RootState } from "@/src/redux-store";

export const getCounter = (state: RootState) => state?.counter;
export const getCount = (state: RootState) => state?.counter?.count ?? 0;
`,
    );

    this.fs.write(
      this.destinationPath(`${d}/counter.sagas.ts`),
      `export function* onCounterChanged() {
  // Example saga — react to counter changes
}
`,
    );
  }

  // ─── Contacts Slice ───────────────────────────────────────

  _writeContactsSlice() {
    const d = "src/redux-store/slices/contacts";

    this.fs.write(
      this.destinationPath(`${d}/index.ts`),
      `import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as selectors from "./contacts.selectors";
import * as sagas from "./contacts.sagas";
import { ContactsState, Contact } from "./contacts.interfaces";

const initialState: ContactsState = {
  items: [],
};

export const contactsStore = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Contact>) => {
      state.items.push(action.payload);
    },
    removeContact: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    clearContacts: (state) => {
      state.items = [];
    },
  },
});

export { selectors, sagas };
`,
    );

    this.fs.write(
      this.destinationPath(`${d}/contacts.interfaces.ts`),
      `export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: string;
  newsletter: boolean;
}

export interface ContactsState {
  items: Contact[];
}
`,
    );

    this.fs.write(
      this.destinationPath(`${d}/contacts.selectors.ts`),
      `import { RootState } from "@/src/redux-store";

export const getContacts = (state: RootState) => state?.contacts;
export const getContactItems = (state: RootState) => state?.contacts?.items ?? [];
export const getContactCount = (state: RootState) => state?.contacts?.items?.length ?? 0;
`,
    );

    this.fs.write(
      this.destinationPath(`${d}/contacts.sagas.ts`),
      `export function* onContactAdded() {
  // Example saga — react to contact additions
}
`,
    );
  }

  // ─── Slices Index (overrides pkg-redux default) ───────────

  _writeSlicesIndex() {
    this.fs.write(
      this.destinationPath("src/redux-store/slices/index.ts"),
      `// Auto-generated by GeNYG Native test-app
import * as extraActions from "../extra-actions";

import * as ui from "./ui";
import * as counter from "./counter";
import * as contacts from "./contacts";

export const reducers = {
  ui: ui.uiStore.reducer,
  counter: counter.counterStore.reducer,
  contacts: contacts.contactsStore.reducer,
};

export const actions = {
  ...extraActions,
  ...ui.uiStore.actions,
  ...counter.counterStore.actions,
  ...contacts.contactsStore.actions,
};

export const selectors = {
  ...ui.selectors,
  ...counter.selectors,
  ...contacts.selectors,
};

export const sagas = [
  ...Object.values(ui.sagas),
  ...Object.values(counter.sagas),
  ...Object.values(contacts.sagas),
];
`,
    );
  }

  // ─── Contact Model ────────────────────────────────────────

  _writeContactModel() {
    this.fs.write(
      this.destinationPath("src/models/Contact/index.ts"),
      `export interface IContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: string;
  newsletter: boolean;
}

export class Contact implements IContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: string;
  newsletter: boolean;

  constructor(data: IContact) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.category = data.category;
    this.newsletter = data.newsletter;
  }

  get fullName(): string {
    return \`\${this.firstName} \${this.lastName}\`;
  }
}
`,
    );
  }
}
