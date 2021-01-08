import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentCommands", (table) => {
    table.increments();
    table.timestamps(undefined, true);

    table.boolean("adminOnly").index().notNullable().defaultTo(false);
    table.integer("environmentId").index().notNullable();
    table.text("commandId").index().notNullable();
    table.text("command").notNullable();
    table.text("title").notNullable();
    table.text("status").index().notNullable().defaultTo("not_ready");
    table.text("logs");
  });
}

export async function down(knex: Knex): Promise<void> {}
