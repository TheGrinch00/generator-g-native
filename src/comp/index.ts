"use strict";
import Generator = require("yeoman-generator");
import chalk = require("chalk");
import yosay = require("yosay");
import fs = require("fs");
import path = require("path");
import PascalCase = require("pascal-case");

module.exports = class extends Generator {
  answers: {
    componentName: string;
    useHooks: boolean;
    useStyles: boolean;
  };

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-native"
        )} component generator, follow the quick and easy configuration to create a new component!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "componentName",
        message: "What is your component name?",
      },
      {
        type: "confirm",
        name: "useHooks",
        message: "Would you like to create a separate hook file?",
        default: true,
      },
      {
        type: "confirm",
        name: "useStyles",
        message: "Would you like to create a separate stylesheet file?",
        default: true,
      },
    ]);

    if (answers.componentName === "") {
      this.log(
        yosay(chalk.red("Please give your component a name next time!"))
      );
      process.exit(1);
      return;
    }

    answers.componentName = PascalCase.pascalCase(answers.componentName);
    this.answers = answers;
  }

  writing() {
    /**
     * Index.tsx component file
     */

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(
        `./src/components/${this.answers.componentName}/index.tsx`
      ),
      {
        ...this.answers,
      }
    );

    /**
     * Index.hooks.tsx hooks file
     */

    if (this.answers.useHooks) {
      this.fs.copyTpl(
        this.templatePath("index.hooks.ejs"),
        this.destinationPath(
          `./src/components/${this.answers.componentName}/index.hooks.tsx`
        ),
        {
          ...this.answers,
        }
      );
    }

    if (this.answers.useStyles) {
      this.fs.copyTpl(
        this.templatePath("styles.ts"),
        this.destinationPath(
          `./src/components/${this.answers.componentName}/styles.ts`
        )
      );
    }

    /**
     * /src/components/index.tsx export file
     */

    const content = `export * from "./${this.answers.componentName}";\n`;

    fs.appendFileSync(
      path.join(this.destinationRoot(), "src", "components", "index.tsx"),
      content
    );
  }
};
