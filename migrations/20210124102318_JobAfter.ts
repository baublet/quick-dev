import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("jobs", (table) => {
    table.bigInteger("after").unsigned().notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {}
