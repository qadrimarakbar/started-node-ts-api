import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('model_has_roles', table => {
    table.integer('role_id').unsigned().notNullable();
    table.string('model_type', 255).notNullable();
    table.integer('model_id').unsigned().notNullable();

    // Primary Key
    table.primary(['role_id', 'model_id', 'model_type']);

    // Foreign Key
    table
      .foreign('role_id')
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    // Indexes
    table.index(['model_id', 'model_type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('model_has_roles');
}
