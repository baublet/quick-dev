import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentCommandLogs", (table) => {
    table.text("id").primary();
    table.timestamps(undefined, true);
    table.text("environmentId").notNullable().index();
    table.text("environmentCommandId").index();
    table.text("logOutput");
    table.text("logOutputPublicUrl");
  });
}

export async function down(knex: Knex): Promise<void> {}
