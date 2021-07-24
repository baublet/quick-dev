import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("repositories", (table) => {
    table.text("id").primary();
    table.timestamps(undefined, true);
    table.text("htmlUrl").notNullable();
    table.text("gitUrl").index().notNullable();
    table.text("source").index().notNullable().defaultTo("github");
    table.text("sourceId").index().notNullable();
    table.text("name").notNullable();
    table.text("userId").notNullable().index();
    table.integer("uses").notNullable().defaultTo(0);
    table.boolean("private").notNullable().defaultTo(false).index();
  });
}

export async function down(knex: Knex): Promise<void> {}
