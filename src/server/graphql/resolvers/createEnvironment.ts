import { Context } from "../../common/context";
import { Environment, environment as envEntity } from "../../common/entities";
import { environmentStateMachine } from "../../common/environmentStateMachine";

interface CreateEnvironmentArguments {
  input: {
    repositoryUrl: string;
  };
}

export async function createEnvironment(
  _parent: unknown,
  { input }: CreateEnvironmentArguments,
  context: Context
): Promise<{ errors: string[]; environment?: Environment }> {
  const operation = await environmentStateMachine.setNew({ input, context });
  if (operation.environment) {
    return {
      errors: operation.errors,
      environment: await envEntity.getByIdOrFail(
        context.db,
        operation.environment.id
      ),
    };
  }
  return {
    errors: operation.errors,
  };
}
