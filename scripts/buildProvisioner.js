require("dotenv").config();

const path = require("path");
const esbuild = require("esbuild");
const glob = require("glob");

console.log("Building provisioner...");

esbuild.buildSync({
  entryPoints: glob.sync(
    path.resolve(
      __dirname,
      "..",
      "src",
      "provisionerV1",
      "provisioner",
      "index.ts"
    )
  ),
  sourcemap: true,
  outfile: path.resolve(__dirname, "..", "builtProvisioner", "provisioner.js"),
  platform: "node",
  bundle: true,
  target: ["node12"],
});

console.log("Provisioner built");
