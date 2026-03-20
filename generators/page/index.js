import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import path from "path";
import fs from "node:fs";
import { fileSelector, ItemType } from "inquirer-file-selector";
import { pascalCase } from "pascal-case";
import { camelCase } from "camel-case";
import { requirePackages } from "../../common/index.js";

import screenTplMod from "./templates/screen.js";
import screenDynTplMod from "./templates/screen.dynamic.js";
import layoutTplMod from "./templates/layout.js";

const screenTpl = screenTplMod?.default || screenTplMod;
const screenDynamicTpl = screenDynTplMod?.default || screenDynTplMod;
const layoutTpl = layoutTplMod?.default || layoutTplMod;

const BASE_APP_DIR = "app";

function analyzeSegment(segment) {
  const isDynamic = segment.startsWith("[");
  if (!isDynamic) {
    return { isDynamic: false };
  }
  const spread = segment.startsWith("[...");
  const name = segment
    .replace("[...", "")
    .replace("[", "")
    .replace("]", "");
  const id = camelCase(name);
  const paramType = spread
    ? `{ ${id}: string[] }`
    : `{ ${id}: string }`;
  return { isDynamic: true, id, paramType };
}

export default class PageGenerator extends Generator {
  async prompting() {
    requirePackages(this, ["core", "ui"]);

    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "GeNYG Native",
        )} Expo Router screen generator!`,
      ),
    );

    const rootAbs = this.destinationPath(BASE_APP_DIR);

    if (!fs.existsSync(rootAbs)) {
      fs.mkdirSync(rootAbs, { recursive: true });
      this.log(chalk.yellow(`Created "${BASE_APP_DIR}/" directory.`));
    }

    const fsSel = await fileSelector({
      message: "Select the parent folder under app/:",
      type: ItemType.Directory,
      basePath: rootAbs,
    });
    const selectedAbs =
      typeof fsSel === "string"
        ? fsSel
        : fsSel?.path || fsSel?.absolutePath || rootAbs;
    const parentRel = path
      .relative(rootAbs, selectedAbs)
      .split(path.sep)
      .join(path.posix.sep);

    const answers = await this.prompt([
      {
        type: "input",
        name: "segment",
        message:
          "New route segment name (e.g. profile, settings, [id], [...params]):",
      },
      {
        type: "input",
        name: "screenTitle",
        message: "Screen title (heading):",
      },
      {
        type: "confirm",
        name: "includeLayout",
        message: "Generate _layout.tsx?",
        default: false,
      },
    ]);

    if (!answers.segment?.trim()) {
      this.log(yosay(chalk.red("Please provide a segment name.")));
      this.abort = true;
      return;
    }

    const seg = answers.segment.trim();
    const segFolder = seg;
    const screenNameBase = seg.replace(/^[\[\.]+|[\]\.]+$/g, "");
    const ScreenName = pascalCase(screenNameBase || "Index");
    const analysis = analyzeSegment(seg);

    this.answers = {
      parentRel,
      segFolder,
      ScreenName,
      screenTitle: answers.screenTitle?.trim() || ScreenName,
      includeLayout: !!answers.includeLayout,
      isDynamic: analysis.isDynamic,
      paramType: analysis.paramType,
      paramId: analysis.id,
    };
  }

  writing() {
    if (this.abort) return;

    const {
      parentRel,
      segFolder,
      ScreenName,
      screenTitle,
      includeLayout,
      isDynamic,
      paramType,
      paramId,
    } = this.answers;

    const routeDir = path.posix.join(
      BASE_APP_DIR,
      parentRel ? parentRel : "",
      segFolder,
    );

    // For Expo Router, the screen file is index.tsx inside the folder
    this.fs.write(
      this.destinationPath(path.posix.join(routeDir, "index.tsx")),
      isDynamic
        ? screenDynamicTpl({ ScreenName, screenTitle, paramType, paramId })
        : screenTpl({ ScreenName, screenTitle }),
    );

    if (includeLayout) {
      this.fs.write(
        this.destinationPath(path.posix.join(routeDir, "_layout.tsx")),
        layoutTpl({ ScreenName, screenTitle }),
      );
    }
  }
}
