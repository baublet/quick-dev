import knex from "knex";

export type Connection = knex<any, unknown[]>;
export type Transaction = knex.Transaction<any, any>;

let dbConnection: Connection;

export function getDatabaseConnection() {
  if (!process.env.DATABASE_CONNECTION) {
    console.log(
      "No database connection (DATABASE_CONNECTION) found in environment."
    );
    process.exit();
  }

  if (!dbConnection) {
    const connectionInfo = JSON.parse(process.env.DATABASE_CONNECTION);

    dbConnection = knex(connectionInfo);
  }
  return dbConnection;
}
