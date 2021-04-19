import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("environmentCommands", (table) => {
    table.text("workingDirectory");
  });
  await knex.schema.alterTable("environments", (table) => {
    table.dropColumn("workingDirectory");
  });
}

export async function down(knex: Knex): Promise<void> {}
