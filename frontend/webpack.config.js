const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require("dotenv");

const env = dotenv.config({ path: path.resolve(__dirname, ".env") }).parsed || {};

module.exports = (_env, argv) => ({
  entry: path.resolve(__dirname, "src/main.tsx"),
  target: "web",
  // Avoid eval-based devtools: the app's CSP intentionally omits
  // 'unsafe-eval', and eval() is how webpack's default dev source maps work.
  devtool: argv.mode === "development" ? "cheap-module-source-map" : false,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    // Dev server needs an absolute publicPath ("/") to resolve requests like
    // /bundle.js. Production uses a relative path ("./") since Electron
    // loads the bundle via file:// where an absolute path would break.
    publicPath: argv.mode === "development" ? "/" : "./",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/template.html"),
    }),
    new webpack.DefinePlugin({
      "process.env.SUPABASE_URL": JSON.stringify(env.SUPABASE_URL || ""),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(env.SUPABASE_ANON_KEY || ""),
      "process.env.API_BASE_URL": JSON.stringify(env.API_BASE_URL || "http://localhost:8000/api/v1"),
    }),
  ],
  devServer: {
    port: 4000,
    // Plain live-reload, not HMR: webpack's hot-update runtime applies
    // patches via new Function(...), which the CSP's lack of 'unsafe-eval'
    // (intentional) blocks. Full reload-on-save still works fine.
    hot: false,
    liveReload: true,
    historyApiFallback: true,
    // The dev-server's error overlay also builds a filter fn via
    // new Function(...) unconditionally at client startup — same CSP
    // conflict. Errors are still visible in the terminal/preview logs.
    client: { overlay: false },
  },
});
