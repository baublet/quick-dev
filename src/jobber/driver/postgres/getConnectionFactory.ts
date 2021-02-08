import knex from "knex";

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
    const connection = knex<T>({
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

    if (withSchema) {
      connection.withSchema(schema);
    }

    return connection;
  };
}
