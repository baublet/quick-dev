import { getDatabaseConnection } from "../src/lambda/common/db";

async function dropDatabase() {
  const db = getDatabaseConnection();
  await db.raw(`DROP SCHEMA IF EXISTS public CASCADE;`);
  await db.destroy();
}

dropDatabase();
