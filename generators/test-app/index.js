import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    this._writeTestApp();
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

  // ─── pkg-core ────────────────────────────────────────────

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
        "@types/qs": "^6.14.0",
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
        qs: "^6.14.0",
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
      tsconfig.compilerOptions.paths = { "@/*": ["./*"] };
      this.fs.writeJSON(tsconfigPath, tsconfig);
    }

    // .npmrc
    this.fs.write(this.destinationPath(".npmrc"), "legacy-peer-deps=true\n");

    // Copy dotfiles from pkg-core templates
    this.fs.copy(path.join(sibling("pkg-core"), ".*"), this.destinationRoot());

    // Create src directories
    for (const dir of ["src/components", "src/models", "src/hooks"]) {
      this.fs.write(this.destinationPath(`${dir}/.gitkeep`), "");
    }
  }

  // ─── pkg-ui ──────────────────────────────────────────────

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

    this.fs.copy(path.join(sibling("pkg-ui"), "**"), this.destinationPath("."));
  }

  // ─── pkg-redux ───────────────────────────────────────────

  _writePkgRedux() {
    this.packageJson.merge({
      dependencies: {
        "@reduxjs/toolkit": "^2.9.0",
        "react-redux": "^9.2.0",
        "redux-persist": "^6.0.0",
        "redux-saga": "^1.3.0",
      },
    });

    this.fs.copy(
      path.join(sibling("pkg-redux"), "**"),
      this.destinationPath("."),
    );
  }

  // ─── pkg-translations ───────────────────────────────────

  _writePkgTranslations() {
    this.packageJson.merge({
      dependencies: {
        i18next: "^24.2.0",
        "react-i18next": "^15.4.0",
      },
    });

    this.fs.copy(
      path.join(sibling("pkg-translations"), "**"),
      this.destinationPath("."),
    );
  }

  // ─── Test App ────────────────────────────────────────────

  _writeTestApp() {
    this.fs.writeJSON(this.destinationPath(".genyg.json"), {
      packages: {
        core: true,
        ui: true,
        redux: true,
        translations: true,
      },
    });

    // Copy all test-app templates (screens, slices, config, translations, etc.)
    const tplDir = path.resolve(__dirname, "templates");
    this.fs.copy(path.join(tplDir, "**"), this.destinationPath("."));
  }
}
