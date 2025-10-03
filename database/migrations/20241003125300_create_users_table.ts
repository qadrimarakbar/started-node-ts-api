import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('users');
  if (exists) {
    return;
  }

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable();
    table.string('email', 100).notNullable().unique();
    table.string('password', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

    table.index(['email'], 'idx_email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
