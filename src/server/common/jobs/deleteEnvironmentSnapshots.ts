import { environmentSnapshot, environment as envEntity } from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { getExternalEnvironmentHandler } from "../../common/externalEnvironmentHandler";

export const deleteEnvironmentSnapshots = async (payload: {
  environmentId: string;
}) => {
  const db = getDatabaseConnection();
  const environment = await envEntity.getByIdOrFail(db, payload.environmentId);
  const snapshots = await environmentSnapshot.getByEnvironmentId(
    db,
    payload.environmentId
  );
  await Promise.all(
    snapshots.map((snapshot) =>
      getExternalEnvironmentHandler(environment).deleteSnapshot(snapshot)
    )
  );
};
