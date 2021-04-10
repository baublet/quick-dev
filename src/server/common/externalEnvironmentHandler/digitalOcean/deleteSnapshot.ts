import { ExternalEnvironmentHandler } from "..";
import { digitalOceanApi } from "./digitalOceanApi";

export const deleteSnapshot: ExternalEnvironmentHandler["deleteSnapshot"] = async (
  environmentSnapshot
) => {
  await digitalOceanApi({
    path: `images/${environmentSnapshot.sourceId}`,
    method: "delete",
    expectJson: false,
    skipCache: true,
  });
};
