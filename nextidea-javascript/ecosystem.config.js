// PM2 Ecosystem Config for cPanel Node.js deployment
// Use this if your cPanel supports PM2 process manager
module.exports = {
  apps: [
    {
      name: "nextidea",
      script: "server.js",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      node_args: "--max-old-space-size=256 --expose-gc",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
    {
      name: "activephysio",
      script: "server.js",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      node_args: "--max-old-space-size=256 --expose-gc",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      error_file: "./logs/activephysio_err.log",
      out_file: "./logs/activephysio_out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
