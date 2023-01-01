"use strict";
import Generator = require("yeoman-generator");
import chalk = require("chalk");
import yosay = require("yosay");
import fs = require("fs");
import path = require("path");

module.exports = class extends Generator {
  answers: {
    accept: boolean;
  };

  async prompting() {
    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper React Native Generator!"
        )}. ${chalk.red(
          "This command SHOULD only be executed right after CEA install, not sooner, not later!"
        )}\nAnd it will install Redux, Sagas, Persist, and basic app templates.`
      )
    );

    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "accept",
        message: "Are you sure to proceed?",
      },
    ]);

    if (!this.answers.accept) {
      process.exit(0);
    }
  }

  writing() {
    /**
     * PACKAGE JSON
     */

    const pkgJson = {
      devDependencies: {
        "babel-plugin-module-resolver": "^4.1.0",
        husky: "4.2.5",
        "lint-staged": "10.2.11",
        prettier: "2.8.1",
      },
      dependencies: {
        "@reduxjs/toolkit": "1.9.1",
        "@hookform/resolvers": "2.8.8",
        axios: "1.2.2",
        "react-hook-form": "7.29.0",
        "react-redux": "8.0.2",
        redux: "^4.2.0",
        "redux-persist": "6.0.0",
        "redux-saga": "1.1.3",
        yup: "0.32.11",
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
        },
      },
      "lint-staged": {
        "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);

    /**
     * TSCONFIG JSON
     */

    const tsConfigJson: any = this.fs.readJSON(
      this.destinationPath("tsconfig.json")
    );
    tsConfigJson.compilerOptions.baseUrl = "src";
    tsConfigJson.compilerOptions.strict = false;
    tsConfigJson.exclude = [
      "node_modules",
      "babel.config.js",
      "metro.config.js",
    ];
    tsConfigJson.extends = "expo/tsconfig.base";

    // Extend or create tsconfig.json file in destination path
    this.fs.write(
      this.destinationPath("tsconfig.json"),
      JSON.stringify(tsConfigJson, null, 2)
    );

    /**
     * GIT_IGNORE
     */

    const gitignoreFile = path.join(this.destinationRoot(), ".gitignore");
    const gitignoreFileExists = fs.existsSync(gitignoreFile);

    const content = "\n.idea\n.eslintcache\n";

    if (gitignoreFileExists) {
      fs.appendFileSync(gitignoreFile, content);
    } else {
      fs.writeFileSync(gitignoreFile, content);
    }

    /**
     * Copy all other files
     */
    this.fs.copy(this.templatePath("."), this.destinationPath("."));

    // Delete original files
    fs.rmSync(path.join(this.destinationRoot(), "components"), {
      recursive: true,
      force: true,
    });
    fs.rmSync(path.join(this.destinationRoot(), "constants"), {
      recursive: true,
      force: true,
    });
    fs.rmSync(path.join(this.destinationRoot(), "hooks"), {
      recursive: true,
      force: true,
    });
    fs.rmSync(path.join(this.destinationRoot(), "navigation"), {
      recursive: true,
      force: true,
    });
    fs.rmSync(path.join(this.destinationRoot(), "screens"), {
      recursive: true,
      force: true,
    });
  }

  install() {
    this.spawnCommand("npm", ["install"]);
  }
};
