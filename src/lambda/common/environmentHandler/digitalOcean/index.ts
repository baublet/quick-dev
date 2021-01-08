import { EnvironmentHandler } from "../index";
import { newEnvironment } from "./newEnvironment";
import { getEnvironment } from "./getEnvironment";
import { destroyEnvironment } from "./destroyEnvironment";
import { createEnvironmentDomainRecord } from "./createEnvironmentDomainRecord";

export const DigitalOceanHandler: EnvironmentHandler = {
  newEnvironment,
  destroyEnvironment,
  getEnvironment,
  createEnvironmentDomainRecord,
};
