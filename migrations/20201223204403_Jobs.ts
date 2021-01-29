import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("jobs", function (table) {
    table.text("id").primary();
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
    table.bigInteger("after").unsigned().notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {}
