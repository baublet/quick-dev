import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentLogs", (table) => {
    table.increments();
    table.integer("environmentId").index();
    table.text("log");
  });
}

export async function down(knex: Knex): Promise<void> {}
