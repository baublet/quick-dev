import { environment as envEntity } from "../entities";
import { getDatabaseConnection } from "../../common/db";
import { setStrapYardUrl } from "../environmentPassthrough";
import { getCurrentUrl } from "../getCurrentUrl";

export const updateEnvironmentStrapYardUrls = async () => {
  return getDatabaseConnection().transaction(async (trx) => {
    const environments = await envEntity.getEnvironmentsWhoseUrlsNeedUpdating(
      trx
    );
    const currentUrl = await getCurrentUrl();

    if (environments.length === 0) {
      return;
    }

    await Promise.all(
      environments.map((environment) =>
        setStrapYardUrl(environment, currentUrl)
      )
    );
  });
};
