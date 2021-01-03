import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("jobs", function (table) {
    table.increments();
    table.timestamps(undefined, true);

    table
      .timestamp("lastTouched")
      .index()
      .notNullable()
      .defaultTo(knex.fn.now());
    table.string("type").notNullable();
    table.string("status").notNullable().index();
    table.string("processor");
    table.string("error");
    table.string("payload");
    table.string("history").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
