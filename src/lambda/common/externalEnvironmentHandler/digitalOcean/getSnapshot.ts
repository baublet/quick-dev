import { ExternalEnvironmentHandler, ExternalEnvironmentSnapshot } from "..";
import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";

export const getSnapshot: ExternalEnvironmentHandler["getSnapshot"] = (
  environment
) => {
  if (!environment.sourceSnapshotId) {
    log.warn(
      `Asked for a snapshot for an environment (${environment.subdomain}) without a snapshot`
    );
    return Promise.resolve(undefined);
  }

  return digitalOceanApi<ExternalEnvironmentSnapshot>({
    path: `images/${environment.sourceSnapshotId}`,
    method: "get",
  });
};
