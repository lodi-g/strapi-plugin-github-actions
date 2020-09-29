"use strict";
const axios = require("axios");

module.exports = {
  getWorkflows: async () => {
    const workflows = await strapi
      .query("workflow", "github-actions")
      .find({ _sort: "name" }, []);

    return workflows;
  },

  triggerWorkflow: async (id) => {
    const workflow = await strapi
      .query("workflow", "github-actions")
      .findOne({ id });
    const url = `https://api.${workflow.github_host}/repos/${workflow.repo_owner}/${workflow.repo_name}/dispatches`;

    await axios.post(
      url,
      {
        event_type: workflow.event_type,
        client_payload: workflow.client_payload,
      },
      {
        headers: {
          Accept: "application/vnd.github.everest-preview+json",
          Authorization: `token ${workflow.pat}`,
        },
      }
    );

    await strapi
      .query("workflow", "github-actions")
      .update({ id }, { started_at: Date.now() });

    return {};
  },
};
