"use strict";
import Generator = require("yeoman-generator");
import chalk = require("chalk");
import yosay = require("yosay");
import fs = require("fs");
import path = require("path");
import PascalCase = require("pascal-case");

module.exports = class extends Generator {
  answers: {
    modelName: string;
  };

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-native"
        )} model generator, follow the quick and easy configuration to create a new model!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "modelName",
        message: "What is your model name?",
      },
    ]);

    if (answers.modelName === "") {
      this.log(yosay(chalk.red("Please give your model a name next time!")));
      process.exit(1);
      return;
    }

    answers.modelName = PascalCase.pascalCase(answers.modelName);
    this.answers = answers;
  }

  writing() {
    /**
     * Index.tsx model file
     */

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(`./models/${this.answers.modelName}/index.tsx`),
      {
        ...this.answers,
      }
    );

    /**
     * /models/index.tsx export file
     */

    const content = `export * from './${this.answers.modelName}';\n`;

    fs.appendFileSync(
      path.join(this.destinationRoot(), "models", "index.tsx"),
      content
    );
  }
};
