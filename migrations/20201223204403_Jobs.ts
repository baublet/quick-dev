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
    table.text("type").notNullable();
    table.text("status").notNullable().index();
    table.text("processor");
    table.text("error");
    table.text("payload");
    table.text("history").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
