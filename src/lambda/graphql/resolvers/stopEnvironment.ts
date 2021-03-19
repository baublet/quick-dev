import { Context } from "../../common/context";
import {
  Environment,
  environment as envEntity,
  environmentDomainRecord,
} from "../../common/entities";
import { environmentStateMachine } from "../../common/environmentStateMachine";
import { DeleteEnvironmentMutationInput } from "../generated";

interface CreateEnvironmentArguments {
  input: DeleteEnvironmentMutationInput;
}

export async function stopEnvironment(
  _parent: unknown,
  { input: { id } }: CreateEnvironmentArguments,
  context: Context
): Promise<{ errors: string[]; environment?: Environment }> {
  const [environment, environmentDomainRecords] = await Promise.all([
    context.service(envEntity.loader).load(id),
    environmentDomainRecord.getByEnvironmentId(context.db, id),
  ]);
  return environmentStateMachine.setStopping({
    trx: context.db,
    environmentDomainRecords,
    environment,
  });
}
