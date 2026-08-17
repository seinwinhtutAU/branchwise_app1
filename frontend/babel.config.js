module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { electron: "32" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};
