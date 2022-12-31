import Generator = require('yeoman-generator')

module.exports = class extends Generator {
  install() {
    // Get folder name
    const folderName = this.destinationRoot().split('/').pop();

    this.spawnCommand("npx", [
      "expo",
      "init",
      folderName,
      "--no-install",
      "--template",
      "tabs"
    ]);
  }
}