import Generator from "yeoman-generator";

export default class AppGenerator extends Generator {
  async install() {
    const run = (cmd, args) =>
      new Promise((resolve, reject) => {
        const child = this.spawnCommand(cmd, args, { stdio: "inherit" });
        child.on("exit", (code) => {
          if (code === 0) return resolve();
          reject(new Error(`${cmd} exited with code ${code}`));
        });
        child.on("error", reject);
      });

    try {
      await run("npx", [
        "create-expo-app@latest",
        ".",
        "--template",
        "blank-typescript",
      ]);
    } catch (err) {
      this.log("\n❌ Installation failed:", err?.message || err);
      throw err;
    }
  }
}
