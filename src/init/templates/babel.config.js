module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            components: "./src/components",
            config: "./src/config",
            constants: "./src/constants",
            hooks: "./src/hooks",
            models: "./src/models",
            navigation: "./src/navigation",
            "redux-store": "./src/redux-store",
            screens: "./src/screens",
          },
        },
      ],
    ],
  };
};
