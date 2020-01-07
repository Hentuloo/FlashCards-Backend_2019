const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
  entry: "./src/app.ts",
  mode: "development",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json"
      })
    ]
  },
  plugins: [
    new NodemonPlugin({
      watch: path.resolve("./build"),
      script: path.resolve("./build/app.js")
    })
  ],
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build")
  }
};
