import DataLoader from "dataloader";

import { Context } from "../context";
import { Environment } from "./index";

function loadEnvironments(
  context: Context,
  ids: readonly number[]
): Promise<Environment[]> {
  return context.db<Environment>("environments").select().whereIn("id", ids);
}

export function loader(context: Context) {
  return new DataLoader<number, Environment>(async (ids) => {
    const idsToNumbers = ids.map((id: string | number) =>
      parseInt(`${id}`, 10)
    );
    const foundEnvironments = await loadEnvironments(context, idsToNumbers);
    return idsToNumbers.map((id) =>
      foundEnvironments.find((env) => env.id === id)
    );
  });
}
