module.exports = {
  apps: [
    {
      name: "discord-n8n-relay",
      script: "./index.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
