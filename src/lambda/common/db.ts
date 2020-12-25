import knex from "knex";

export type Connection = knex<any, unknown[]>;
export type Transaction = knex.Transaction<any, any>;

declare global {
  module NodeJS {
    interface Global {
      dbConnection: Connection;
    }
  }
}

export function getDatabaseConnection() {
  if (!process.env.DATABASE_CONNECTION) {
    console.log(
      "No database connection (DATABASE_CONNECTION) found in environment."
    );
    process.exit();
  }

  if (!global.dbConnection) {
    const connectionInfo = JSON.parse(process.env.DATABASE_CONNECTION);

    global.dbConnection = knex(connectionInfo);
  }
  return global.dbConnection;
}
