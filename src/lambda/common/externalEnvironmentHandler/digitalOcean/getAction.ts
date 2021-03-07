import { ExternalEnvironmentHandler } from "../index";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const getAction: ExternalEnvironmentHandler["getAction"] = async (
  environment,
  environmentAction
) => {
  log.info("Destroying a DigitalOcean environment and its domain records", {
    environment: environment.name,
    environmentAction,
  });

  const parsedPayload = JSON.parse(environmentAction.actionPayload);

  const foundAction = await digitalOceanApi<{
    id: string;
    status: "in-progress" | "completed" | "errored";
    type: string;
  }>({
    path: `droplets/${environment.sourceId}/actions/${parsedPayload.id}`,
    method: "post",
    body: {
      type: "shutdown",
    },
  });

  return foundAction;
};
