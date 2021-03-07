import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentSnapshots", (table) => {
    table.text("id").primary();
    table.timestamps(undefined, true);

    table.text("environmentId").index().notNullable();
    table.text("sourceId").index();
    table.text("source").index().notNullable();
    table.boolean("deleted").index().notNullable().defaultTo(false);
    table.boolean("deletedInProvider").index().notNullable().defaultTo(false);
    table.float("sizeInGb").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
