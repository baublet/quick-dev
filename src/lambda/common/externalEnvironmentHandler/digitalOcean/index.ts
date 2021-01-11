import { ExternalEnvironmentHandler } from "../index";

import { createEnvironmentDomainRecord } from "./createEnvironmentDomainRecord";
import { destroyEnvironment } from "./destroyEnvironment";
import { environmentExists } from "./environmentExists";
import { getEnvironment } from "./getEnvironment";
import { newEnvironment } from "./newEnvironment";

export const DigitalOceanHandler: ExternalEnvironmentHandler = {
  createEnvironmentDomainRecord,
  destroyEnvironment,
  environmentExists,
  getEnvironment,
  newEnvironment,
};
