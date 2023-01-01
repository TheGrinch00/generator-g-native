import Generator = require('yeoman-generator')

module.exports = class extends Generator {
  answers: { appName: string };

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "appName",
        message: "What will you app be called?"
      }
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
      "tabs"
    ]);
  }
}