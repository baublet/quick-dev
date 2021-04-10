import { Context } from "../../common/context";
import {
  Environment,
  environment as envEntity,
  environmentDomainRecord,
} from "../../common/entities";
import { environmentStateMachine } from "../../common/environmentStateMachine";
import { DeleteEnvironmentMutationInput } from "../generated";

interface StopEnvironmentArguments {
  input: DeleteEnvironmentMutationInput;
}

export async function stopEnvironment(
  _parent: unknown,
  { input: { id } }: StopEnvironmentArguments,
  context: Context
): Promise<{ errors: string[]; environment?: Environment }> {
  const [environment, environmentDomainRecords] = await Promise.all([
    context.service(envEntity.loader).load(id),
    environmentDomainRecord.getByEnvironmentId(context.db, id),
  ]);
  const operation = await environmentStateMachine.setStopping({
    trx: context.db,
    environmentDomainRecords,
    environment,
  });
  return {
    errors: operation.errors,
    environment: await envEntity.getByIdOrFail(context.db, id),
  };
}
