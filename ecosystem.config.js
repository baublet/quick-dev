module.exports = {
  apps: [
    {
      name: "server",
      script: "./node_modules/.bin/netlify",
      args: "dev",
      node_args: "--max_old_space_size=2048",
      max_memory_restart: "1024M",
      env: {
        DEBUG: "true",
      },
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
