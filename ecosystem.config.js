module.exports = {
  apps: [
    {
      name: "functions",
      script: "./node_modules/.bin/netlify",
      args: "dev",
      env: {
        DEBUG: "true",
      },
    },
    {
      name: "webpack",
      script: "./node_modules/.bin/webpack-cli",
      args: "-c webpack.web.js --watch",
    },
    {
      name: "worker",
      script: "./devWorkers.js",
    },
    {
      name: "ngrok",
      script: "./ngrok.js",
    },
  ],
};
