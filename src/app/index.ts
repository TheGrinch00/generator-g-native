import Generator = require("yeoman-generator");
import yosay = require("yosay");
import chalk = require("chalk");

module.exports = class extends Generator {
  answers: { appName: string };

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-native"
        )} app generator, follow the quick and easy configuration to create a new app 
            and don't forget to run \nyo g-native:init \ninside the created folder!`
      )
    );

    this.answers = await this.prompt([
      {
        type: "input",
        name: "appName",
        message: "What will you app be called?",
      },
    ]);

    if (!this.answers.appName) {
      process.exit(0);
    }
  }
  install() {
    this.spawnCommandSync("npx", [
      "expo",
      "init",
      this.answers.appName,
      "--no-install",
      "--template",
      "tabs",
    ]);
  }
};
