if (process.env.NODE_ENV !== "production") {
  require("longjohn");
}

require("@babel/polyfill/noConflict");
require("dotenv").config();
require("source-map-support").install();
