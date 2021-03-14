import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("environments", (table) => {
    table.text("sourceSnapshotId").nullable().index();
  });
}

export async function down(knex: Knex): Promise<void> {}
