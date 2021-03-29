import { ExternalEnvironmentHandler, ExternalEnvironmentSnapshot } from "..";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const getSnapshot: ExternalEnvironmentHandler["getSnapshot"] = async (
  environment
) => {
  if (!environment.sourceSnapshotId) {
    if (!environment.sourceId) {
      log.error("Asked for a snapshot on an environment without a source ID!", {
        environment: environment.subdomain,
      });
      return undefined;
    }
    log.debug(
      `Asked for a snapshot for an environment (${environment.subdomain}) without a snapshot`
    );

    const found = await digitalOceanApi<{
      snapshots: {
        id: number;
        name: string;
        type: "snapshot" | "backup" | "custom";
        slug: string | null;
      }[];
    }>({
      path: `droplets/${environment.sourceId}/snapshots`,
      method: "get",
    });

    if (found.snapshots.length === 0) {
      log.debug("Environment has no snapshots, yet. Waiting...", {
        environment: environment.subdomain,
      });
      return undefined;
    }

    return {
      id: `${found.snapshots[0].id}`,
      name: found.snapshots[0].name,
      status: "available",
    };
  }

  return digitalOceanApi<ExternalEnvironmentSnapshot>({
    path: `images/${environment.sourceSnapshotId}`,
    method: "get",
  });
};
