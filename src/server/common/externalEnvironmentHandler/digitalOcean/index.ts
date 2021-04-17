import { ExternalEnvironmentHandler } from "../index";

import { createEnvironmentDomainRecord } from "./createEnvironmentDomainRecord";
import { destroyEnvironment } from "./destroyEnvironment";
import { environmentExists } from "./environmentExists";
import { getAction } from "./getAction";
import { getEnvironment } from "./getEnvironment";
import { getSnapshot } from "./getSnapshot";
import { newEnvironment } from "./newEnvironment";
import { removeAllTrace } from "./removeAllTrace";
import { shutdownEnvironment } from "./shutdownEnvironment";
import { snapshotEnvironment } from "./snapshotEnvironment";
import { deleteSnapshot } from "./deleteSnapshot";
import { getOrCreateSSHKey } from "./getOrCreateSSHKey";

export const DigitalOceanHandler: ExternalEnvironmentHandler = {
  createEnvironmentDomainRecord,
  deleteSnapshot,
  destroyEnvironment,
  environmentExists,
  getAction,
  getEnvironment,
  getOrCreateSSHKey,
  getSnapshot,
  newEnvironment,
  removeAllTrace,
  shutdownEnvironment,
  snapshotEnvironment,
};
