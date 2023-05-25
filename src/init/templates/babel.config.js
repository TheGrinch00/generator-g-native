module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      [
        "module-resolver",
        {
          alias: {
            components: "./components",
            config: "./config",
            constants: "./constants",
            hooks: "./hooks",
            models: "./models",
            navigation: "./navigation",
            "redux-store": "./redux-store",
            screens: "./screens",
          },
        },
      ],
    ],
  };
};
