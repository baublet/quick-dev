import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("jobs", function (table) {
    table.bigInteger("pulse").unsigned().notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {}
