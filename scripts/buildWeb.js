require("dotenv").config();

const path = require("path");
const fs = require("fs");

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

async function getGithubUrl() {
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

  return replace(
    process.env.GITHUB_CLIENT_REDIRECT_URI,
    "{STRAPYARD_URL}",
    process.env.STRAPYARD_URL
  );
}

const esbuild = require("esbuild");

(async () => {
  fs.copyFileSync(
    path.resolve(__dirname, "..", "src/web/index.html"),
    path.resolve(__dirname, "..", "builtWeb", "index.html")
  );
  const githubRedirectUri = await getGithubUrl();

  console.log("Building web...");

  esbuild.buildSync({
    entryPoints: ["src/web/index.tsx"],
    bundle: true,
    sourcemap: true,
    outfile: "builtWeb/app.js",
    define: {
      "process.env.DEBUG": `'${process.env.DEBUG}'`,
      "process.env.GITHUB_CLIENT_ID": `'${process.env.GITHUB_CLIENT_ID}'`,
      "process.env.GITHUB_CLIENT_SECRET": `'${process.env.GITHUB_CLIENT_SECRET}'`,
      "process.env.GITHUB_CLIENT_REDIRECT_URI": `'${githubRedirectUri}'`,
      "process.env.GITHUB_CLIENT_PROXY_URL": `'${process.env.GITHUB_CLIENT_PROXY_URL}'`,
      "process.env.GITHUB_CLIENT_SCOPE": `'${process.env.GITHUB_CLIENT_SCOPE}'`,
      "process.env.NODE_ENV": "false",
    },
  });

  console.log("Frontend built");
})();
