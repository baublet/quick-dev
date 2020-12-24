import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable("tokens", (table) => {
    table.uuid("id").primary();
    table.boolean("used").defaultTo("false");
    table.dateTime("expires");
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {}
