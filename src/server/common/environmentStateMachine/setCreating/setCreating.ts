import { SetCreatingArguments } from ".";
import { StateMachineReturnValue } from "..";
import { environment as envEntity } from "../../entities";
import { DigitalOceanHandler } from "../../externalEnvironmentHandler/digitalOcean";
import { canSetCreating } from "./canSetCreating";

export async function setCreating({
  trx,
  environment,
}: SetCreatingArguments): Promise<StateMachineReturnValue> {
  let createdDropletId: string = "";

  const canContinue = await canSetCreating({ trx, environment });
  if (canContinue.operationSuccess === false) {
    return canContinue;
  }

  try {
    await envEntity.update(trx, environment.id, {
      lifecycleStatus: "creating",
    });
    const createdDroplet = await DigitalOceanHandler.newEnvironment(
      environment
    );
    createdDropletId = createdDroplet.id;
    const updatedEntity = await envEntity.update(trx, environment.id, {
      sourceId: createdDroplet.id,
    });
    return {
      errors: [],
      operationSuccess: true,
      environment: updatedEntity,
    };
  } catch (e) {
    if (createdDropletId) {
      await DigitalOceanHandler.destroyEnvironment(environment, []);
    }
    return {
      errors: [e.message, e.stack],
      operationSuccess: false,
    };
  }
}
