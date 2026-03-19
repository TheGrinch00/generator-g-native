import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import path from "path";
import { pascalCase } from "pascal-case";
import { requirePackages } from "../../common/index.js";

export default class ModelGenerator extends Generator {
  async prompting() {
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "GeNYG Native",
        )} model generator, follow the quick and easy configuration to create a new model!`,
      ),
    );

    const baseAnswers = await this.prompt([
      {
        type: "input",
        name: "modelName",
        message: "What is your model name?",
        validate: (v) => !!(v && v.trim()) || "Please enter a model name",
        filter: (v) => (v || "").trim(),
      },
    ]);

    if (!baseAnswers.modelName) {
      this.log(yosay(chalk.red("Please give your model a name next time!")));
      this.abort = true;
      return;
    }

    const modelName = pascalCase(baseAnswers.modelName).trim();

    this.answers = {
      modelName,
    };
  }

  writing() {
    if (this.abort) return;

    const { modelName } = this.answers;
    const destDir = path.posix.join("src/models", modelName);

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(path.posix.join(destDir, "index.ts")),
      { modelName },
    );
  }
}
