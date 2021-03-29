import { Context } from "../../common/context";
import { Environment } from "../../common/entities";
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
  return environmentStateMachine.setNew({ input, context });
}
