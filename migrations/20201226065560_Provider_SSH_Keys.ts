import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("providerSSHKeys", (table) => {
    table.increments();
    table.timestamps(undefined, true);

    table.integer("sshKeyId").index().notNullable();

    table.text("userSource").notNullable();
    table.text("user").notNullable();

    table.text("source").defaultTo("do").notNullable().index();
    table.text("sourceId"); // e.g., ID of the SSH key in DO
  });
}

export async function down(knex: Knex): Promise<void> {}
