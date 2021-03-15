import { Environment } from "./index";
import { Connection } from "../../db";

export async function rescueEnvironments(db: Connection) {
  return db<Environment>("environments")
    .update({
      working: false,
      updated_at: new Date(),
    })
    .andWhere((db) => {
      db.where("deleted", "=", false);
      db.where("working", "=", true);
      db.where("updated_at", "<", new Date(Date.now() - 1000 * 60));
    })
    .returning("*");
}
