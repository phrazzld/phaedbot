// phaedbot/src/config.js

module.exports = {
  projectId: process.env.PROJECT_ID,
  githubAccessToken: process.env.GITHUB_ACCESS_TOKEN,
  port: process.env.PORT || 8080,
  isProd: process.env.NODE_ENV === 'production',
};
