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
  return () => {
    const primedConnection = knex({
      client: "pg",
      connection: {
        host,
        port,
        user: username,
        password,
        database,
      },
    }).withSchema(schema);

    return primedConnection;
  };
}
