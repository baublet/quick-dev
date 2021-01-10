import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environmentDomainRecords", (table) => {
    table.text("id").primary();

    table.text("environmentId").notNullable().index();
    table.text("type").notNullable();
    table.text("data").notNullable();
    table.boolean("deleted").notNullable().defaultTo(false);
    table.text("provider").notNullable();
    table.text("providerId").notNullable();
    table.text("name").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
