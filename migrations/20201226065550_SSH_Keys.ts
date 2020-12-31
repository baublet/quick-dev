import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sshKeys", (table) => {
    table.increments();
    table.timestamps();
    table.string("userSource").notNullable();
    table.string("user").notNullable();
    table.string("privateKey").notNullable();
    table.string("publicKey").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
