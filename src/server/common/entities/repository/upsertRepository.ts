import { ulid } from "ulid";

import { Repository } from "./index";
import { Connection } from "../../db";

export async function upsertRepository(
  db: Connection,
  {
    userId,
    use,
    htmlUrl,
    gitUrl,
    name,
    sourceId,
    source,
    isPrivate,
  }: {
    userId: string;
    use: boolean;
    htmlUrl: string;
    gitUrl: string;
    name: string;
    sourceId: string;
    source: "github";
    isPrivate: boolean;
  }
) {
  const environments = await db<Repository>("repositories")
    .select()
    .andWhere((b) => {
      b.where("userId", "=", userId);
      b.where("sourceId", "=", sourceId);
    })
    .returning("id");

  const environmentId = environments[0];
  if (environmentId && use) {
    await db<Repository>("repositories")
      .update({
        uses: db.raw("uses + 1"),
        updated_at: new Date(0),
      })
      .where("id", "=", environmentId)
      .limit(1);
  } else {
    await db<Repository>("repositories").insert({
      id: ulid(),
      gitUrl,
      htmlUrl,
      name,
      uses: 0,
      userId,
      source,
      sourceId,
      private: isPrivate,
    });
  }
}
