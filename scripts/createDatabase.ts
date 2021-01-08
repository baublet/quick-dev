import { getDatabaseConnection } from "../src/lambda/common/db";

async function createDatabase() {
  const db = getDatabaseConnection();
  await db.raw(`CREATE SCHEMA public;`);
  await db.destroy();
}

createDatabase();
