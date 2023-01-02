"use strict";
import Generator = require("yeoman-generator");
import chalk = require("chalk");
import yosay = require("yosay");
import fs = require("fs");
import path = require("path");
import PascalCase = require("pascal-case");

module.exports = class extends Generator {
  answers: {
    sceneName: string;
    useHooks: boolean;
    useStyles: boolean;
  }
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-native"
        )} screen generator, follow the quick and easy configuration to create a new screen!`
      )
    );

    this.answers = await this.prompt([
      {
        type: "input",
        name: "sceneName",
        message: "What is your screen name?"
      },
      {
        type: "confirm",
        name: "useHooks",
        message: "Would you like to create a separate hook file?",
        default: true
      },
      {
        type: "confirm",
        name: "useStyles",
        message: "Would you like to create a separate style file?",
        default: true
      }
    ]);

    if (this.answers.sceneName === "") {
      this.log(yosay(chalk.red("Please give your screen a name next time!")));
      process.exit(1);
      return;
    }

    this.answers.sceneName = PascalCase.pascalCase(this.answers.sceneName);
  }

  writing() {
    /**
     * index.tsx screen file
     */

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(`./src/screens/${this.answers.sceneName}/index.tsx`),
      {
        ...this.answers
      }
    );

    /**
     * index.hooks.tsx hooks file
     */

    if (this.answers.useHooks) {
      this.fs.copyTpl(
        this.templatePath("index.hooks.ejs"),
        this.destinationPath(
          `./src/screens/${this.answers.sceneName}/index.hooks.tsx`
        ),
        {
          ...this.answers
        }
      );
    }

    /**
     * styles.ts file
     */

    if (this.answers.useStyles) {
        this.fs.copyTpl(
            this.templatePath("styles.ts"),
            this.destinationPath(
            `./src/screens/${this.answers.sceneName}/styles.ts`
            ),
            {
            ...this.answers
            }
        );
    }

    /**
     * /src/screens/index.tsx export file
     */

    const content = `export * from './${this.answers.sceneName}';\n`;

    fs.appendFileSync(
      path.join(this.destinationRoot(), "src", "screens", "index.tsx"),
      content
    );
  }
};
