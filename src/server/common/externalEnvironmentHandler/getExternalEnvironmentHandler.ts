import { DigitalOceanHandler } from "./digitalOcean";
import { EnvironmentSource } from "../entities/environment";
import { ExternalEnvironmentHandler } from "./index";

const ExternalEnvironmentHandlers: Record<
  EnvironmentSource,
  ExternalEnvironmentHandler
> = {
  digital_ocean: DigitalOceanHandler,
};

export function getExternalEnvironmentHandler({
  source,
}: {
  source: EnvironmentSource;
}) {
  if (ExternalEnvironmentHandlers[source]) {
    return ExternalEnvironmentHandlers[source];
  }
  throw new Error(`Unhandled/unknown environment source: ${source}`);
}
