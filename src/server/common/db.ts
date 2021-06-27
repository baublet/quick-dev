require("dotenv").config();

import knex from "knex";

import { log } from "../../common/logger";

export type Connection = knex<any, unknown[]>;
export type Transaction = knex.Transaction<any, any>;
export type ConnectionOrTransaction = Connection | Transaction;
export type QueryBuilder<T = any> = knex.QueryBuilder<T, any>;

declare global {
  module NodeJS {
    interface Global {
      dbConnection: Connection;
    }
  }
}

export function getDatabaseConnection() {
  if (!process.env.DATABASE_CONNECTION) {
    log.error(
      "db.ts: No database connection (DATABASE_CONNECTION) found in environment."
    );
    process.exit(1);
  }

  if (!global.dbConnection) {
    log.debug(
      "db.ts: No DB connection exists in global context. Creating one..."
    );
    const connectionInfo = JSON.parse(process.env.DATABASE_CONNECTION);
    // If we're in sqlite, never save the DB connection to global context. Why?
    // Because SQLite only allows a single connection instance at a time. So
    // if we keep it open in the global context, no other functions can access
    // the database!
    if (connectionInfo.client.includes("sqlite")) {
      log.debug(
        "db.ts: SQLite connection detected. Making a transient connection..."
      );
      return knex(connectionInfo);
    }
    global.dbConnection = knex(connectionInfo);
  }
  return global.dbConnection;
}

export async function createTestConnection() {
  if (!global.dbConnection) {
    global.dbConnection = await knex({
      client: "sqlite3",
      connection: ":memory:",
      useNullAsDefault: true,
    });
  }
}

export async function getTestConnection() {
  if (!global.dbConnection) {
    await createTestConnection();
  }

  return global.dbConnection;
}

export async function destroyTestConnection() {
  if (global.dbConnection) {
    await global.dbConnection.destroy();
  }
}
