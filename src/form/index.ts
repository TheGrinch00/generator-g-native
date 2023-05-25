"use strict";
import Generator = require("yeoman-generator");
import chalk = require("chalk");
import yosay = require("yosay");
import fs = require("fs");
import path = require("path");
import PascalCase = require("pascal-case");

module.exports = class extends Generator {
  answers: {
    formName: string;
  };

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-native"
        )} form generator, follow the quick and easy configuration to create a new form!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "formName",
        message: "What is your form name?",
      },
    ]);

    if (answers.formName === "") {
      this.log(yosay(chalk.red("Please give your form a name next time!")));
      process.exit(1);
      return;
    }

    answers.formName = PascalCase.pascalCase(answers.formName);
    this.answers = answers;
  }

  writing() {
    /**
     * Index.tsx form file
     */

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(
        `./components/${this.answers.formName}/index.tsx`
      ),
      {
        ...this.answers,
      }
    );

    /**
     * Index.hooks.tsx hooks file
     */

    this.fs.copyTpl(
      this.templatePath("index.hooks.ejs"),
      this.destinationPath(
        `./components/${this.answers.formName}/index.hooks.tsx`
      ),
      {
        ...this.answers,
      }
    );

    /**
     * /forms/index.tsx export file
     */

    const content = `export * from './${this.answers.formName}';\n`;

    fs.appendFileSync(
      path.join(this.destinationRoot(), "components", "index.tsx"),
      content
    );
  }
};
