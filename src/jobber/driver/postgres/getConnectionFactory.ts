import knex from "knex";

declare global {
  namespace NodeJS {
    interface Global {
      __PG_CONNECTION__: knex<any, unknown[]>;
    }
  }
}

export function getConnectionFactory({
  host,
  port,
  schema,
  username,
  password,
  database,
}: {
  host: string;
  port: number;
  schema: string;
  username: string;
  password: string;
  database: string;
}) {
  return <T = any>(withSchema: boolean = true) => {
    if (!global.__PG_CONNECTION__) {
      global.__PG_CONNECTION__ = knex<T>({
        client: "pg",
        connection: {
          host,
          port,
          user: username,
          password,
          database,
        },
        pool: {
          min: 2,
          max: 10,
        },
      });
    }

    const connection = global.__PG_CONNECTION__;

    if (withSchema) {
      connection.withSchema(schema);
    }

    return connection as knex<any, unknown[]>;
  };
}
