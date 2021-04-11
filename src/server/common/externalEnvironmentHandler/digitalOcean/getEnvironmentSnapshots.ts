import { ExternalEnvironmentHandler, ExternalEnvironmentSnapshot } from "..";
import { digitalOceanApi } from "./digitalOceanApi";

export const getSnapshot: ExternalEnvironmentHandler["getSnapshot"] = async (
  environment
) => {
  if (!environment.sourceSnapshotId) {
    throw new Error(
      `Fatal error: tried to get a snapshot for an environment without a source snapshot ID associated with it!`
    );
  }

  const externalSnapshot = await digitalOceanApi<{
    id: string;
    type: "snapshot" | "backup" | "custom";
    name: string;
    status: "available" | "pending" | "deleted";
    size_gigabytes: number;
  }>({
    path: `images/${environment.sourceSnapshotId}`,
    method: "get",
  });

  return {
    ...externalSnapshot,
    sizeInGb: externalSnapshot.size_gigabytes,
  };
};
