const path = require("path");

const prod = process.env.NODE_ENV === "production";

const PROVISIONER_PATH = path.resolve(
  process.cwd(),
  "src",
  "provisionerV1",
  "provisioner"
);

const PROVISIONER_ENTRY_PATH = path.resolve(PROVISIONER_PATH, "index.ts");

module.exports = {
  entry: PROVISIONER_ENTRY_PATH,
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "provisioner.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  mode: "development",
  target: "node",
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
};
