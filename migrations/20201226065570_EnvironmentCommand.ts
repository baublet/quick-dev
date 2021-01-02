import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentCommands", (table) => {
    table.increments();
    table.timestamps();

    table.boolean("adminOnly").index().notNullable().defaultTo(false);
    table.integer("environmentId").index().notNullable();
    table.string("commandId").index().notNullable();
    table.string("command").notNullable();
    table.string("title").notNullable();
    table.string("status").index().notNullable().defaultTo("not_ready");
    table.string("logs");
  });
}

export async function down(knex: Knex): Promise<void> {}
