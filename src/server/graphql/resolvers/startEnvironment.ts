import { Context } from "../../common/context";
import { Environment, environment as envEntity } from "../../common/entities";
import { environmentStateMachine } from "../../common/environmentStateMachine";
import { StartEnvironmentMutationInput } from "../generated";

interface StartEnvironmentArguments {
  input: StartEnvironmentMutationInput;
}

export async function startEnvironment(
  _parent: unknown,
  { input: { id } }: StartEnvironmentArguments,
  context: Context
): Promise<{ errors: string[]; environment?: Environment }> {
  const environment = await context.service(envEntity.loader).load(id);
  const operation = await environmentStateMachine.setStartingFromSnapshot({
    trx: context.db,
    environment,
  });
  return {
    errors: operation.errors,
    environment: await envEntity.getByIdOrFail(context.db, id),
  };
}
