"use strict";
const createError = require("http-errors");

function getService() {
  return strapi.plugins["github-actions"].services["github-actions"];
}

module.exports = {
  getWorkflows: async (ctx) => {
    const workflows = await getService().getWorkflows();
    ctx.send({ workflows });
  },

  triggerWorkflow: async (ctx) => {
    const id = parseInt(ctx.params.id, 10);
    if (isNaN(id)) {
      throw createError(400, "Invalid id");
    }

    const res = await getService().triggerWorkflow(id);
    ctx.send(res);
  },
};
