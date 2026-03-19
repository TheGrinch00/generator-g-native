import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
} from "../../common/index.js";

export default class PkgTranslationsGenerator extends Generator {
  async prompting() {
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Hi! Welcome to ${chalk.blue(
          "GeNYG Native",
        )}. ${chalk.red(
          "This command will install i18next with expo-localization and set up translations for your app.",
        )}`,
      ),
    );

    const configFile = getGenygConfigFile(this);
    if (configFile?.packages?.translations) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the translations package was already installed!",
          ),
        ),
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
        i18next: "^24.2.0",
        "react-i18next": "^15.4.0",
        "expo-localization": "*",
      },
    });

    // Copy translation template files
    this.fs.copy(this.templatePath("."), this.destinationPath("."));

    extendConfigFile(this, {
      packages: {
        translations: true,
      },
    });
  }

  async install() {
    if (this.abort) return;

    const run = (cmd, args) =>
      new Promise((resolve, reject) => {
        const child = this.spawnCommand(cmd, args, { stdio: "inherit" });
        child.on("exit", (code) =>
          code === 0
            ? resolve()
            : reject(new Error(`${cmd} exited with ${code}`)),
        );
        child.on("error", reject);
      });

    try {
      await run("npx", ["expo", "install", "--fix"]);
    } catch (err) {
      this.log("\n❌ Dependencies installation failed:", err?.message || err);
      throw err;
    }
  }
}
