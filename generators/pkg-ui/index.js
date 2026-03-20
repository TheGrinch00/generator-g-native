import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
} from "../../common/index.js";

export default class PkgUiGenerator extends Generator {
  async prompting() {
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Hi! Welcome to ${chalk.blue(
          "GeNYG Native",
        )}. ${chalk.red(
          "This command will install NativeWind (Tailwind CSS for React Native) and configure your project.",
        )}`,
      ),
    );

    const configFile = getGenygConfigFile(this);
    if (configFile?.packages?.ui) {
      this.log(
        yosay(chalk.red("It looks like the UI package was already installed!")),
      );
      this.abort = true;
      return;
    }

    const { accept } = await this.prompt([
      {
        type: "confirm",
        name: "accept",
        message: "Are you sure to proceed?",
        default: true,
      },
    ]);

    if (!accept) {
      this.abort = true;
    }
  }

  writing() {
    if (this.abort) return;

    this.packageJson.merge({
      dependencies: {
        nativewind: "^4.1.0",
        "@tanstack/react-form": "^1.11.0",
      },
      devDependencies: {
        tailwindcss: "^3.4.0",
        "babel-preset-expo": "^13.0.0",
      },
    });

    // Copy template files
    this.fs.copy(this.templatePath("."), this.destinationPath("."));

    // Ensure app.json has web bundler set to metro (required by NativeWind)
    const appJsonPath = this.destinationPath("app.json");
    const appJson = this.fs.readJSON(appJsonPath);
    if (appJson) {
      appJson.expo = appJson.expo || {};
      appJson.expo.web = appJson.expo.web || {};
      appJson.expo.web.bundler = "metro";
      this.fs.writeJSON(appJsonPath, appJson);
    }

    // Create global.css with theme CSS variables
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

  .dark {
    --color-primary: 59 130 246;
    --color-primary-foreground: 255 255 255;
    --color-secondary: 167 139 250;
    --color-accent: 251 191 36;
    --color-destructive: 248 113 113;
    --color-success: 74 222 128;
    --color-background: 15 23 42;
    --color-foreground: 248 250 252;
    --color-muted: 148 163 184;
    --color-muted-foreground: 100 116 139;
    --color-border: 30 41 59;
    --color-input: 30 41 59;
    --color-card: 30 41 59;
  }
}
`,
    );

    // Add global.css import to root layout
    const layoutPath = this.destinationPath("app/_layout.tsx");
    const layoutContent = this.fs.read(layoutPath);
    if (layoutContent && !layoutContent.includes("global.css")) {
      this.fs.write(layoutPath, `import "../global.css";\n${layoutContent}`);
    }

    extendConfigFile(this, {
      packages: {
        ui: true,
      },
    });
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
      await run("npx", ["expo", "install", "react-native-reanimated", "react-native-worklets"]);
    } catch (err) {
      this.log("\n❌ Dependencies installation failed:", err?.message || err);
      throw err;
    }
  }
}
