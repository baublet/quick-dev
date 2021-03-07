import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentActions", (table) => {
    table.text("id").primary();
    table.text("environmentId").unique().index().notNullable();
    table.text("actionPayload").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
