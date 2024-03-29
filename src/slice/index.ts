"use strict";
import Generator = require("yeoman-generator");
import chalk = require("chalk");
import yosay = require("yosay");
import PascalCase = require("pascal-case");

module.exports = class extends Generator {
  answers: {
    sliceName: string;
    useSagas: boolean;
  };

  async prompting() {
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-g-native"
        )} redux slice generator, follow the quick and easy configuration to create a new slice!`
      )
    );

    const answers = await this.prompt([
      {
        type: "input",
        name: "sliceName",
        message: "What is your slice name?",
      },
      {
        type: "confirm",
        name: "useSagas",
        message: "Would you like to create a saga file?",
        default: true,
      },
    ]);

    if (answers.sceneName === "") {
      this.log(yosay(chalk.red("Please give your slice a name next time!")));
      process.exit(1);
      return;
    }

    this.answers = answers;
  }

  writing() {
    const { useSagas, sliceName } = this.answers;
    const pCsliceName = PascalCase.pascalCase(sliceName);

    /**
     * Slice/index.tsx file
     */

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath(`./redux-store/slices/${sliceName}/index.ts`),
      {
        sliceName,
        pCsliceName,
        useSagas,
      }
    );

    /**
     * Slice/interface/index.tsx file
     */

    this.fs.copyTpl(
      this.templatePath("interface.index.ejs"),
      this.destinationPath(
        `./redux-store/slices/${sliceName}/${sliceName}.interfaces.ts`
      ),
      {
        pCsliceName,
      }
    );

    /**
     * Slice/selectors/index.tsx file
     */

    this.fs.copyTpl(
      this.templatePath("selectors.index.ejs"),
      this.destinationPath(
        `./redux-store/slices/${sliceName}/${sliceName}.selectors.ts`
      ),
      {
        sliceName,
        pCsliceName,
      }
    );

    // Slice/sagas/index.tsx file
    if (useSagas) {
      this.fs.copyTpl(
        this.templatePath("sagas.index.ejs"),
        this.destinationPath(
          `./redux-store/slices/${sliceName}/${sliceName}.sagas.ts`
        ),
        {
          sliceName,
        }
      );
    }

    let slicesIndex = this.fs.read(
      this.destinationPath(`./redux-store/slices/index.ts`)
    );

    let match = slicesIndex.match(/import(.*?);\n\n/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}import * as ${sliceName} from "./${sliceName}";

`
    );

    match = slicesIndex.match(/(.*)Store(.*?).reducer,?\n}/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(
        0,
        -1
      )}  ${sliceName}: ${sliceName}.${sliceName}Store.reducer,
}`
    );
    match = slicesIndex.match(/(.*)Store(.*?).actions,?\n}/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}  ...${sliceName}.${sliceName}Store.actions,
}`
    );
    match = slicesIndex.match(/(.*).selectors,?\n}/)[0];
    slicesIndex = slicesIndex.replace(
      match,
      `${match.slice(0, -1)}  ...${sliceName}.selectors,
}`
    );
    if (useSagas) {
      match = slicesIndex.match(/(.*)Object.values(.*),?\n]/)[0];
      slicesIndex = slicesIndex.replace(
        match,
        `${match.slice(0, -1)}  ...Object.values(${sliceName}.sagas),
]`
      );
    }

    this.fs.write(
      this.destinationPath(`./redux-store/slices/index.ts`),
      slicesIndex
    );
  }
};
