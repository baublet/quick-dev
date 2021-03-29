import {
  environment as envEntity,
  environmentCommand as envCommandEntity,
} from "../../common/entities";
import { Context } from "../../common/context";
import { throwIfUserDoesNotOwnEnvironment } from "../../common/authorization/throwIfUserDoesNotOwnEnvironment";
import { environmentCommandLogs as logsResolver } from "./environmentCommand/logs";
import { EnvironmentCommand, EnvironmentCommandLogsInput } from "../generated";

export async function environmentCommandLogs(
  _parent: unknown,
  args: { input: EnvironmentCommandLogsInput },
  context: Context
): Promise<EnvironmentCommand> {
  const environmentCommand = await context
    .service(envCommandEntity.loader)
    .load(args.input.environmentCommandId || "");

  if (!environmentCommand) {
    throw new Error("Environment command not found");
  }

  const environment = await context
    .service(envEntity.loader)
    .load(environmentCommand.environmentId);

  if (!environment) {
    throw new Error("Environment not found");
  }
  throwIfUserDoesNotOwnEnvironment(context.user, environment);

  return {
    ...environmentCommand,
    logs: await logsResolver(
      environmentCommand,
      { input: args.input },
      context
    ),
  };
}
