import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentLocks", (table) => {
    table.increments("id").primary();
    table.timestamps(undefined, true);
    table
      .text("environmentId")
      .unique()
      .notNullable()
      .references("id")
      .inTable("environments");
  });
  await knex.schema.createTable("environmentCommandLocks", (table) => {
    table.increments("id").primary();
    table.timestamps(undefined, true);
    table
      .text("environmentCommandId")
      .unique()
      .notNullable()
      .references("id")
      .inTable("environmentCommands");
  });
}

export async function down(knex: Knex): Promise<void> {}
