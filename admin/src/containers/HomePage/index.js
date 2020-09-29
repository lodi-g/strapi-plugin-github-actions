import React, { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List } from "@buffetjs/custom";
import { CustomRow } from "@buffetjs/styles";
import { Button, Text } from "@buffetjs/core";
import { request } from "strapi-helper-plugin";
import dayjs from "dayjs";

import useWorkflowsList from "../../hooks/useWorkflowsList";
import pluginId from "../../pluginId";

const WorkflowRow = ({ onClick, ...workflow }) => (
  <CustomRow>
    <td>
      <Text fontWeight="semiBold">{workflow.name}</Text>
    </td>
    <td>
      <Text>{workflow.description || "No description"}</Text>
    </td>
    <td>
      <Text>
        {dayjs(workflow.started_at).format("DD/MM/YYYY HH:mm:ss") ||
          "Never triggered"}
      </Text>
    </td>
    <td>
      <Button
        color="primary"
        icon={<FontAwesomeIcon icon="play" />}
        label="Start"
        onClick={onClick}
      />
    </td>
  </CustomRow>
);

const HomePage = () => {
  const { workflows, isLoading, getData: fetchWorkflows } = useWorkflowsList();

  const triggerWorkflow = async (id) => {
    try {
      await request(`/${pluginId}/workflows/${id}/trigger`);
      strapi.notification.success("Dispatched event!");
      fetchWorkflows();
    } catch (e) {
      strapi.notification.error(
        "An error occured. Maybe the repository can not be reached with the current settings?"
      );
    }
  };

  return (
    <div style={{ margin: 20, padding: 10 }}>
      <List
        title="Start a workflow"
        items={workflows}
        isLoading={isLoading}
        customRowComponent={(workflow) => (
          <WorkflowRow
            onClick={() => triggerWorkflow(workflow.id)}
            {...workflow}
          />
        )}
      />
    </div>
  );
};

export default memo(HomePage);
