import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tokens", (table) => {
    table.increments();
    table.uuid("token").notNullable().unique().index();
    table.boolean("used").defaultTo("false").index();
    table.dateTime("expires").notNullable().index();
    table.timestamps();
  });
}

export async function down(knex: Knex): Promise<void> {}
