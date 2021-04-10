import { environmentSnapshot } from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { DigitalOceanHandler } from "../../common/externalEnvironmentHandler/digitalOcean";

export const deleteEnvironmentSnapshots = async (payload: {
  environmentId: string;
}) => {
  const db = getDatabaseConnection();
  const snapshots = await environmentSnapshot.getByEnvironmentId(
    db,
    payload.environmentId
  );
  await Promise.all(
    snapshots.map((snapshot) => DigitalOceanHandler.deleteSnapshot(snapshot))
  );
};
