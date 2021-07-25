import { Repository } from "./index";
import { Connection } from "../../db";

export async function getPopularRepositories(db: Connection, userId: string) {
  const environments = await db<Repository>("repositories")
    .select()
    .andWhere((b) => {
      b.where("userId", "=", userId);
    })
    .limit(5)
    .orderBy("uses")
    .orderBy("updated_at")
    .returning("*");

  return environments;
}
