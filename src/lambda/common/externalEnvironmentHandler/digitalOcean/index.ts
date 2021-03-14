import { ExternalEnvironmentHandler } from "../index";

import { createEnvironmentDomainRecord } from "./createEnvironmentDomainRecord";
import { destroyEnvironment } from "./destroyEnvironment";
import { environmentExists } from "./environmentExists";
import { getAction } from "./getAction";
import { getEnvironment } from "./getEnvironment";
import { newEnvironment } from "./newEnvironment";
import { shutdownEnvironment } from "./shutdownEnvironment";
import { snapshotEnvironment } from "./snapshotEnvironment";
import { getSnapshot } from "./getSnapshot";

export const DigitalOceanHandler: ExternalEnvironmentHandler = {
  createEnvironmentDomainRecord,
  destroyEnvironment,
  environmentExists,
  getAction,
  getEnvironment,
  getSnapshot,
  newEnvironment,
  shutdownEnvironment,
  snapshotEnvironment,
};
