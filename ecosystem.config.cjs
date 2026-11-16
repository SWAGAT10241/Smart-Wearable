module.exports = {
  apps: [
    {
      name: "trailguard-backend",
      cwd: "./backend",
      script: "server.js",
      instances: 4,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "../logs/pm2-backend-error.log",
      out_file: "../logs/pm2-backend-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
