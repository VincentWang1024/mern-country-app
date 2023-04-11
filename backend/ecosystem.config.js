module.exports = {
    apps: [
      {
        name: 'mern-app',
        script: 'server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
        error_file: './logs/error.log',
        out_file: './logs/access.log',
        log_file: './logs/combined.log',
        time: true,
      },
    ],
  };
  