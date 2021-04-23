import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("providerSSHKeys", (table) => {
    table.text("id").primary();
    table.timestamps(undefined, true);

    table.text("sshKeyId").index().notNullable();
    table.text("userId").notNullable().index();
    table.text("source").defaultTo("do").notNullable().index();
    table.text("sourceId"); // e.g., ID of the SSH key in DO
  });
}

export async function down(knex: Knex): Promise<void> {}
