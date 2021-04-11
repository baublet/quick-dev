import { ExternalEnvironmentHandler, ExternalEnvironmentSnapshot } from "..";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const getSnapshot: ExternalEnvironmentHandler["getSnapshot"] = async (
  environment
) => {
  let sourceSnapshotId: string | undefined = environment.sourceSnapshotId;

  if (!environment.sourceSnapshotId) {
    const snapshots = await digitalOceanApi<{
      snapshots: {
        id: number;
      }[];
    }>({
      path: `droplets/${environment.sourceId}/snapshots`,
      method: "get",
      skipCache: true,
    });
    if (snapshots.snapshots.length > 0) {
      sourceSnapshotId = `${snapshots.snapshots[0].id}`;
    }
  }

  if (!sourceSnapshotId) {
    log.debug("No snapshot yet exists on the environment. Skipping...");
    return undefined;
  }

  const externalSnapshot = await digitalOceanApi<{
    id?: "not_found";
    image?: {
      id: string;
      type: "snapshot" | "backup" | "custom";
      name: string;
      status: "available" | "pending" | "deleted";
      size_gigabytes: number;
    };
  }>({
    path: `images/${sourceSnapshotId}`,
    method: "get",
  });

  if (!externalSnapshot.image) {
    log.debug("External snapshot not yet saved as an image", {
      externalSnapshot,
    });
    return undefined;
  }

  return {
    ...externalSnapshot.image,
    sizeInGb: externalSnapshot.image.size_gigabytes,
  };
};
