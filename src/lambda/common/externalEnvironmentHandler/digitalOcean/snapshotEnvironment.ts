import { ExternalEnvironmentHandler } from "../index";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

function getSnapshotId(dropletId: string): Promise<string> {
  let attemptsLeft = 25;
  return new Promise(async (resolve) => {
    const intervalId = setInterval(async () => {
      if (attemptsLeft === 0) {
        throw new Error(
          `getSnapshotId upper poll limit exceeded! Droplet ID: ${dropletId}`
        );
      }
      attemptsLeft = attemptsLeft - 1;

      const { snapshots } = await digitalOceanApi<{
        snapshots: {
          id: number;
        }[];
      }>({
        path: `droplets/${dropletId}/snapshots`,
        method: "get",
      });

      if (snapshots.length === 0) {
        return;
      }

      clearInterval(intervalId);
      resolve(`${snapshots[0].id}`);
    }, 500);
  });
}

export const snapshotEnvironment: ExternalEnvironmentHandler["snapshotEnvironment"] = (
  environment
) => {
  return new Promise(async (resolve) => {
    log.info("Snapshotting a DigitalOcean environment", {
      environment: environment.subdomain,
    });

    if (!environment.sourceId) {
      log.error("Unable to snapshot an environment without a source ID!", {
        environment,
      });
      throw new Error("Unable to snapshot an environment without a source ID!");
    }

    await digitalOceanApi({
      path: `droplets/${environment.sourceId}/actions`,
      method: "post",
      body: {
        type: "snapshot",
        name: `${environment.subdomain}-${environment.id}`,
      },
    });

    return await getSnapshotId(environment.sourceId);
  });
};
