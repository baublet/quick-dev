import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable("jobs", function (table) {
    table.increments();
    table.timestamps();
    table.string("name");
    table.string("status").index("job_status");
    table.string("processor");
    table.string("error");
    table.string("payload");
  });
}

export async function down(knex: Knex): Promise<void> {}
