const path = require("path");

module.exports = {
  apps: [
    {
      name: "pretty-vision",
      script: "./src/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      node_args: "--max-old-space-size=256",
      max_memory_restart: "280M",
      env: {
        NODE_ENV: "production",
        PORT: 5057,
        MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/prettyvision"
      },
      error_file: "./logs/pm2-err.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      combine_logs: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
};
