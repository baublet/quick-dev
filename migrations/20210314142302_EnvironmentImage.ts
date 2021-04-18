import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("environments", (table) => {
    table.text("source").defaultTo("ubuntu-16-04-x64");
  });
}

export async function down(knex: Knex): Promise<void> {}
