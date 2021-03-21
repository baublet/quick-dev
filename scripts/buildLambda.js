require("dotenv").config();

const path = require("path");
const esbuild = require("esbuild");
const glob = require("glob");

console.log("Building functions...");

esbuild.buildSync({
  entryPoints: glob.sync(
    path.resolve(__dirname, "..", "src", "lambda", "*.ts")
  ),
  sourcemap: true,
  outdir: path.resolve(__dirname, "..", "builtFunctions"),
  platform: "node",
  bundle: true,
  target: ["node12"],
  external: [
    "abort-controller",
    "apollo-server-lambda",
    "bee-queue",
    "dataloader",
    "dotenv",
    "faker",
    "graceful-fs",
    "js-yaml",
    "jsbn",
    "knex",
    "mkdirp",
    "node-fetch",
    "pg",
    "redis-parser",
    "redis",
    "source-map-support",
    "ssh-keygen",
    "ssh2",
    "sshpk",
    "tweetnacl",
    "ulid",
  ],
});

console.log("Functions built");
