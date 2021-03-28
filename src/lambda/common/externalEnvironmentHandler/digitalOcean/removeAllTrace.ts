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

  if (snapshots.snapshots) {
    await Promise.all(
      snapshots.snapshots.map(async (snapshot) => {
        await digitalOceanApi({
          path: `images/${snapshot.id}`,
          method: "delete",
        });
      })
    );
  }
};
