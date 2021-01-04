import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("environments", (table) => {
    table.increments();
    table.timestamps(undefined, true);

    table.string("subdomain").unique().index();
    table.string("name").notNullable();
    table.string("ipv4");
    table.string("secret").index().notNullable().unique();
    table.boolean("deleted").index().defaultTo(false);
    table.integer("sshKeyId").index().notNullable();
    table.string("source").defaultTo("do").notNullable().index();
    table.string("sourceId"); // e.g., ID of the environment in DO
    table.string("userSource").defaultTo("github").index(); // e.g., GitHub
    table.string("user").notNullable().index(); // e.g., their GitHub email
    table.string("repositoryUrl").notNullable();
    table.string("lifecycleStatus").notNullable().defaultTo("new").index();
    table.string("processor").index();
    table.string("size").notNullable().defaultTo("s");
    table.string("strapYardFile").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
