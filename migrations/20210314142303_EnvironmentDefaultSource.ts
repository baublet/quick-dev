import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("environments", (table) => {
    table.dropColumn("source");
  });
  await knex.schema.alterTable("environments", (table) => {
    table.text("source").defaultTo("digital_ocean").notNullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {}
