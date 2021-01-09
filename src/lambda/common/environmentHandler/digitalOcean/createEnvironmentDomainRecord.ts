import { log } from "../../../../common/logger";
import { digitalOceanApi } from "./digitalOceanApi";
import { EnvironmentHandler } from "../index";

export const createEnvironmentDomainRecord: EnvironmentHandler["createEnvironmentDomainRecord"] = async (
  type,
  name,
  data
) => {
  log.info("Creating a DigitalOcean environment domain record", {
    type,
    name,
    data,
  });

  const created = await digitalOceanApi<{
    domain_record: {
      id: number;
    };
  }>({
    expectStatus: 201,
    path: `domains/${process.env.STRAPYARD_DOMAIN}/records`,
    method: "post",
    body: {
      type,
      name,
      data,
      ttl: 30,
    },
  });

  return {
    providerId: `${created.domain_record.id}`,
  };
};
