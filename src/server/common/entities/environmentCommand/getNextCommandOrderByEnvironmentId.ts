import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../../db";

export async function getNextCommandOrderByEnvironmentId(
  trx: ConnectionOrTransaction,
  environmentId: string
): Promise<number> {
  const result = await trx<EnvironmentCommand>("environmentCommands")
    .max("order")
    .where("environmentId", "=", environmentId);
  if (result[0]["max"] === null) {
    return 0;
  }
  return result[0]["max"] + 100;
}
