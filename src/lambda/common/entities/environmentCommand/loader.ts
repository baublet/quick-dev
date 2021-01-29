import DataLoader from "dataloader";

import { Context } from "../../context";
import { EnvironmentCommand } from "./index";

function loadEnvironmentCommands(
  context: Context,
  ids: readonly string[]
): Promise<EnvironmentCommand[]> {
  return context
    .db<EnvironmentCommand>("environmentCommands")
    .select()
    .whereIn("id", ids);
}

export function loader(context: Context) {
  return new DataLoader<string, EnvironmentCommand>(async (ids) => {
    const foundEnvironments = await loadEnvironmentCommands(context, ids);
    return ids.map(
      (id) =>
        foundEnvironments.find((env) => env.id === id) ||
        new Error(`Environment command with ID ${id} does not exist`)
    );
  });
}
