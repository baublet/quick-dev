import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environments", (table) => {
    table.uuid("id").primary();
    table.timestamps(undefined, true);

    table.text("subdomain").unique().index();
    table.text("name").notNullable();
    table.text("ipv4");
    table.text("secret").index().notNullable().unique();
    table.boolean("deleted").index().defaultTo(false);
    table.integer("sshKeyId").index().notNullable();
    table.text("source").defaultTo("do").notNullable().index();
    table.text("sourceId"); // e.g., ID of the environment in DO
    table.text("userSource").defaultTo("github").index(); // e.g., GitHub
    table.text("user").notNullable().index(); // e.g., their GitHub email
    table.text("repositoryUrl").notNullable();
    table.text("lifecycleStatus").notNullable().defaultTo("new").index();
    table.text("processor").index();
    table.text("size").notNullable().defaultTo("s");
    table.text("strapYardFile").notNullable();
    table.text("startupLogs");
  });
}

export async function down(knex: Knex): Promise<void> {}
