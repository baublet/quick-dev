import { create } from "../../common/environmentDomainRecord";
import { getById } from "../../common/environment";
import {DigitalOceanHandler} from "../../common/environmentHandler/digitalOcean"

import { ConnectionOrTransaction } from "../../common/db";

export const setupEnvironmentDomain = async (
  trx: ConnectionOrTransaction,
  payload: {
    environmentId: string;
  }
) => {
  const environment = await getById(trx, payload.environmentId);
  
  // DigitalOceanHandler.createEnvironmentDomainRecord()
};
