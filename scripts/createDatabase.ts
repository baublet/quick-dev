import { getDatabaseConnection } from "../src/server/common/db";

async function createDatabase() {
  const db = getDatabaseConnection();
  await db.raw(`CREATE SCHEMA public;`);
  await db.destroy();
}

createDatabase();
