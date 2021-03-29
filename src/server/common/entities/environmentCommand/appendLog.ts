import { EnvironmentCommand } from "./index";
import { ConnectionOrTransaction } from "../../db";
import { getByIdOrFail } from "./getByIdOrFail";
import Knex from "knex";

type UpdateEnvironmentCommandInput = Partial<EnvironmentCommand>;

export async function appendLog(
  trx: ConnectionOrTransaction,
  id: EnvironmentCommand["id"],
  text: string
): Promise<EnvironmentCommand> {
  const command = await getByIdOrFail(trx, id, ["logs"]);

  const result = await trx<EnvironmentCommand>("environmentCommands")
    .update({
      updated_at: trx.fn.now(),
      logs: command.logs === null ? text : trx.raw("logs || ?", [text]),
    })
    .where({ id })
    .limit(1)
    .returning("*");

  return result[0];
}
