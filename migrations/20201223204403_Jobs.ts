import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("jobs", function (table) {
    table.increments();
    table.timestamps();
    table.string("type").notNullable();
    table.string("status").notNullable().index("jobStatus");
    table.string("processor");
    table.string("error");
    table.string("payload");
  });
}

export async function down(knex: Knex): Promise<void> {}
