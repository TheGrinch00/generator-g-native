import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
} from "../../common/index.js";

export default class PkgReduxGenerator extends Generator {
  async prompting() {
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Hi! Welcome to ${chalk.blue(
          "GeNYG Native",
        )}. ${chalk.red(
          "This command will install Redux Toolkit, Redux Saga, Redux Persist, and scaffold the store.",
        )}`,
      ),
    );

    const configFile = getGenygConfigFile(this);
    if (configFile?.packages?.redux) {
      this.log(
        yosay(chalk.red("It looks like the Redux package was already installed!")),
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
        "@reduxjs/toolkit": "^2.9.0",
        "react-redux": "^9.2.0",
        "redux-persist": "^6.0.0",
        "redux-saga": "^1.3.0",
      },
    });

    // Copy Redux store template files
    this.fs.copy(this.templatePath("."), this.destinationPath("."));

    extendConfigFile(this, {
      packages: {
        redux: true,
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
      await run("npx", ["expo", "install", "@react-native-async-storage/async-storage"]);
      await run("npm", ["install"]);
    } catch (err) {
      this.log("\n❌ Dependencies installation failed:", err?.message || err);
      throw err;
    }
  }
}
