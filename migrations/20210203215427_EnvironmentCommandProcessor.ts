import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("environmentCommands", (table) => {
    table.text("processor").index();
  });
}

export async function down(knex: Knex): Promise<void> {}
