import { ExternalEnvironmentHandler } from "../index";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { cache } from "../../cache";

export const getAction: ExternalEnvironmentHandler["getAction"] = async (
  environment,
  environmentAction
) => {
  const cacheKey = `get-action-${environmentAction.id}`;
  log.info("getAction", {
    environment: environment.name,
    environmentAction,
  });

  const cached = await cache.get<{
    id: string;
    status: "in-progress" | "completed" | "errored";
    type: string;
  }>(cacheKey);

  if (cached) {
    return cached;
  }

  const parsedPayload = environmentAction.actionPayload
    ? JSON.parse(environmentAction.actionPayload)
    : {};

  const foundAction = await digitalOceanApi<{
    action: {
      id: string;
      status: "in-progress" | "completed" | "errored";
      type: string;
    };
  }>({
    path: `droplets/${environment.sourceId}/actions/${parsedPayload.action.id}`,
    method: "get",
  });
  if (foundAction.action) {
    await cache.set(cacheKey, foundAction.action);
  }

  return foundAction.action;
};
