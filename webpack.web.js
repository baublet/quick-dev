require("dotenv").config();

const path = require("path");
const fs = require("fs");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ngrokPath = path.resolve(__dirname, ".ngrokDomain");

function isNgrokUp() {
  return new Promise((resolve) => {
    if (fs.existsSync(ngrokPath)) {
      return resolve(true);
    }
    setTimeout(() => resolve(false), 500);
  });
}

function ngrokUrl() {
  return new Promise((resolve) => {
    fs.readFile(ngrokPath, (err, data) => {
      resolve(data.toString());
    });
  });
}

function replace(haystack, needle, replaceNeedleWith) {
  return haystack.replace(needle, replaceNeedleWith);
}

module.exports = () => {
  return new Promise(async (resolve) => {
    // If the StrapYard URL is `ngrok`, wait for the ngrok domain to be up
    if (process.env.STRAPYARD_URL === "ngrok") {
      let ngrokUp = false;
      for (let i = 5; i > 0; i++) {
        ngrokUp = await isNgrokUp();
        if (ngrokUp) {
          break;
        }
      }
      if (!ngrokUp) {
        console.log(
          "Webpack could not build because ngrok domain never properly configured!"
        );
        process.exit(1);
      } else {
        process.env.STRAPYARD_URL = await ngrokUrl();
      }
    }

    const githubRedirectUri = replace(
      process.env.GITHUB_CLIENT_REDIRECT_URI,
      "{STRAPYARD_URL}",
      process.env.STRAPYARD_URL
    );

    resolve({
      entry: "./src/web/index.tsx",
      devtool: process.env.NODE_ENV === "production" ? undefined : "eval",
      watchOptions: {
        ignored: /node_modules/,
      },
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
          title: "StrapYard",
          template: "src/web/index.html",
          scriptLoading: "defer",
          publicPath: "/",
        }),
        new webpack.DefinePlugin({
          "process.env.GITHUB_CLIENT_ID": `'${process.env.GITHUB_CLIENT_ID}'`,
          "process.env.GITHUB_CLIENT_SECRET": `'${process.env.GITHUB_CLIENT_SECRET}'`,
          "process.env.GITHUB_CLIENT_REDIRECT_URI": `'${githubRedirectUri}'`,
          "process.env.GITHUB_CLIENT_PROXY_URL": `'${process.env.GITHUB_CLIENT_PROXY_URL}'`,
        }),
      ],
    });
  });
};
