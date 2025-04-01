const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.ouders, (table) => {
      table.increments('id');
      table.string('naam', 255).notNullable();
      table.string('voornaam', 255).notNullable();
      table.string('telefoonnummer').notNullable();

      table.unique('telefoonnummer', 'idx_ouder_telefoonnummer');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.ouders);
  },
};