require("dotenv").config();

const path = require("path");
const esbuild = require("esbuild");
const glob = require("glob");

console.log("Building server...");

esbuild.buildSync({
  entryPoints: glob.sync(path.resolve(process.cwd(), "src", "**/*.ts")),
  sourcemap: true,
  outdir: path.resolve(__dirname, "..", "builtServer"),
  platform: "node",
  bundle: false,
  target: ["node12"],
  format: "cjs",
});

console.log("Server built");
