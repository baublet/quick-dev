const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

require('dotenv').config()

module.exports = {
  entry: "./src/web/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              configFile: "tsconfig.web.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "entry.js",
    path: path.resolve(__dirname, "builtWeb"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "QuickStrap",
      template: "src/web/index.html",
      scriptLoading: "defer",
      publicPath: "/"
    }),
    new webpack.DefinePlugin({
      "process.env.GITHUB_CLIENT_ID": `'${process.env.GITHUB_CLIENT_ID}'`,
      "process.env.GITHUB_CLIENT_SECRET": `'${process.env.GITHUB_CLIENT_SECRET}'`,
      "process.env.GITHUB_CLIENT_REDIRECT_URI": `'${process.env.GITHUB_CLIENT_REDIRECT_URI}'`,
      "process.env.GITHUB_CLIENT_PROXY_URL": `'${process.env.GITHUB_CLIENT_PROXY_URL}'`,
    }),
  ],
};
