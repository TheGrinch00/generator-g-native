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
        "lucide-react-native": "^0.511.0",
      },
      devDependencies: {
        tailwindcss: "^3.4.0",
      },
    });

    // Copy template files
    this.fs.copy(this.templatePath("."), this.destinationPath("."));

    // Create global.css
    this.fs.write(
      this.destinationPath("global.css"),
      `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`,
    );

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
