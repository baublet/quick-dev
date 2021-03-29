import { ExternalEnvironmentHandler, ExternalEnvironmentSnapshot } from "..";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const removeAllTrace: ExternalEnvironmentHandler["removeAllTrace"] = async (
  environment
) => {
  log.debug("Removing all trace of environment from DO", {
    environment: environment.subdomain,
  });

  const snapshots = await digitalOceanApi<{
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

  const snapshotIdsToDelete: string[] = environment.sourceSnapshotId
    ? [environment.sourceSnapshotId]
    : [];

  if (snapshots.snapshots) {
    snapshotIdsToDelete.push(
      ...snapshots.snapshots.map((snapshot) => `${snapshot.id}`)
    );
  }

  if (!snapshotIdsToDelete.length) {
    log.debug("No snapshots to delete", { snapshots });
    return;
  }

  await Promise.all(
    snapshotIdsToDelete.map(async (id) => {
      await digitalOceanApi({
        path: `images/${id}`,
        method: "delete",
        expectJson: false,
        skipCache: true,
      });
    })
  );
};
