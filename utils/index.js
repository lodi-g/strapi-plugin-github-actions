module.exports = {
  getConfig: () => {
    return strapi.plugins["github-actions"].config;
  },
}