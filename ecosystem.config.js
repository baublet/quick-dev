module.exports = {
  apps: [
    {
      name: "server",
      script: "./node_modules/.bin/netlify",
      args: "dev --watch",
      env: {
        DEBUG: "true",
        NODE_OPTIONS: "--inspect",
      },
      max_memory_restart: "1G",
    },
    {
      name: "build-lambda",
      script: "./scripts/buildLambda.js",
      watch: ["src/lambda", "src/common"],
      autorestart: false,
    },
    {
      name: "build-web",
      script: "./scripts/buildWeb.js",
      watch: ["src/web", "src/common"],
      autorestart: false,
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
