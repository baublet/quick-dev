require("dotenv").config();

const path = require("path");
const fs = require("fs");
const esbuild = require("esbuild");
const glob = require("glob");

console.log("Building functions...");

esbuild.buildSync({
  entryPoints: glob.sync(
    path.resolve(__dirname, "..", "src", "lambda", "**", "*.ts")
  ),
  sourcemap: true,
  outdir: path.resolve(__dirname, "..", "builtFunctions"),
  platform: "node",
  bundle: true,
  target: ["node12"],
  external: ["knex"],
});

console.log("Functions built");
