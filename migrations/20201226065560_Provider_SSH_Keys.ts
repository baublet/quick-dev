import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("providerSSHKeys", (table) => {
    table.increments();
    table.timestamps(undefined, true);

    table.integer("sshKeyId").index().notNullable();

    table.string("userSource").notNullable();
    table.string("user").notNullable();

    table.string("source").defaultTo("do").notNullable().index();
    table.string("sourceId"); // e.g., ID of the SSH key in DO
  });
}

export async function down(knex: Knex): Promise<void> {}
