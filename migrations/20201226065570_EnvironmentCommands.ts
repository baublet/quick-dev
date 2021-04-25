import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentCommands", (table) => {
    table.text("id").primary();
    table.timestamps(undefined, true);

    table.boolean("adminOnly").index().notNullable().defaultTo(false);
    table.text("environmentId").index().notNullable();
    table.text("command").notNullable();
    table.text("title").notNullable();
    table.text("status").index().notNullable().defaultTo("not_ready");
    table.integer("order").notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {}
