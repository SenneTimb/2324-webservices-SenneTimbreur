const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.leiding, (table) => {
      table.string('email').notNullable(); 

      table.string('password_hash').notNullable();

      table.jsonb('roles').notNullable(); 

      table.unique('email', 'idx_leiding_email_unique');
    });
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.leiding, (table) => {
      table.dropColumns('email', 'password_hash', 'roles');
    });
  },
};
