import fs from "node:fs";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import { extendConfigFile } from "../../common/index.js";

export default class PkgCoreGenerator extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "React Native Expo Yeoman Generator (GeNYG Native)",
        )}. ${chalk.red(
          "This command SHOULD only be executed right after create-expo-app install, not sooner, not later!",
        )}\nIt will install core development tools and configuration.`,
      ),
    );

    const { accept } = await this.prompt([
      {
        type: "confirm",
        name: "accept",
        message: "Are you sure to proceed?",
        default: true,
      },
    ]);

    if (!accept) {
      this.log(chalk.yellow("Aborted by user."));
      this.abort = true;
    }
  }

  writing() {
    if (this.abort) return;

    // Set entry point to expo-router
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

    // Update app.json with scheme for expo-router deep linking
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
      this.fs.writeJSON(appJsonPath, appJson);
    }

    // Remove old entry point files (replaced by expo-router/entry)
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

    // Create .npmrc to avoid peer dependency conflicts from expo-router's transitive deps
    this.fs.write(
      this.destinationPath(".npmrc"),
      "legacy-peer-deps=true\n",
    );

    // Copy project config files (dotfiles only in this template)
    this.fs.copy(this.templatePath(".*"), this.destinationRoot());

    // Create .genyg.json config
    this.fs.writeJSON(this.destinationPath(".genyg.json"), {
      packages: {
        core: true,
        ui: false,
        redux: false,
        translations: false,
      },
    });

    // Create Expo Router app/ directory with root layout
    this.fs.write(
      this.destinationPath("app/_layout.tsx"),
      `import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
`,
    );

    this.fs.write(
      this.destinationPath("app/index.tsx"),
      `import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", letterSpacing: -0.5, color: "#111" }}>
          Home
        </Text>
        <Text style={{ fontSize: 16, color: "#6b7280", marginTop: 8 }}>
          Welcome to your app.
        </Text>
      </View>
    </SafeAreaView>
  );
}
`,
    );

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
      this.fs.write(
        this.destinationPath(`${dir}/.gitkeep`),
        "",
      );
    }
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
      await run("npx", ["expo", "install",
        "expo-router",
        "expo-linking",
        "expo-constants",
        "react-native-screens",
        "react-native-safe-area-context",
        "react-native-gesture-handler",
        "react-dom",
        "@expo/metro-runtime",
        "@expo/vector-icons",
        "@shopify/flash-list",
      ]);
    } catch (err) {
      this.log("\n❌ Dependencies installation failed:", err?.message || err);
      throw err;
    }
  }
}
