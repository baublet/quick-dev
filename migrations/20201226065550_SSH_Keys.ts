import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sshKeys", (table) => {
    table.increments();
    table.timestamps(undefined, true);

    table.text("userSource").notNullable();
    table.text("user").notNullable();
    table.text("fingerprint").notNullable().index();
    table.text("privateKey").notNullable();
    table.text("publicKey").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
