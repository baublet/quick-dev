import { todo } from "../common/jobs/todo";
import {getDatabaseConnection} from "../common/db"

export async function doAJob(processor: string): Promise<void> {
  const db = getDatabaseConnection();
  const trx = await db.transaction();
  const jobToDo = await todo(trx, processor);

  if(!jobToDo) {
    return;
  }


}
