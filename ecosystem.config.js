module.exports = {
  apps: [
    {
      name: "server",
      script: "builtServer/server/server.js",
      watch: ["builtServer"],
      max_memory_restart: "1G",
    },
    {
      name: "worker",
      script: "builtServer/server/worker.js",
      watch: ["builtServer"],
      max_memory_restart: "1G",
    },
    {
      name: "build-server",
      script: "./scripts/buildServer.js",
      watch: ["src/server", "src/common", "./scripts/buildServer.js"],
      autorestart: false,
    },
    {
      name: "build-web",
      script: "./scripts/buildWeb.js",
      watch: ["src/web", "src/common", "./scripts/buildServer.js"],
      autorestart: false,
    },
    // {
    //   name: "worker",
    //   script: "./devWorkers.js",
    // },
  ],
};
