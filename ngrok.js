const ngrok = require("ngrok");
const path = require("path");
const fs = require("fs");

const ngrokPath = path.resolve(__dirname, ".ngrokDomain");

(async function () {
  const url = await ngrok.connect(8888);
  console.log("ngrok domain: " + url);
  fs.writeFileSync(ngrokPath, url);
})();
