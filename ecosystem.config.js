module.exports = {
  apps: [
    {
      name: "functions",
      script: "./node_modules/.bin/netlify",
      args: "dev",
      node_args: "--max_old_space_size=2048",
      max_memory_restart: '1024M',
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
