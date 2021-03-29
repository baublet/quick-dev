import {
  environment as envEntity,
  Environment,
} from "../../../common/entities";
import { Context } from "../../../common/context";
import { throwIfUserDoesNotOwnEnvironment } from "../../../common/authorization/throwIfUserDoesNotOwnEnvironment";

interface EnvironmentInput {
  input: {
    id: string;
  };
}

export async function environment(
  _parent: unknown,
  args: EnvironmentInput,
  context: Context
): Promise<Environment> {
  const id = args.input.id;
  const environment = await envEntity.getById(context.db, id);

  if (!environment) {
    throw new Error("Environment not found");
  }

  throwIfUserDoesNotOwnEnvironment(context.user, environment);

  return environment;
}
