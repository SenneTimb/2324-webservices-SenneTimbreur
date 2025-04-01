const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.huisarts, (table) => {
      table.increments('id');
      table.string('naam', 255).notNullable();
      table.string('voornaam', 255).notNullable();
      table.string('telefoonnummer');

      table.unique('telefoonnummer', 'idx_huisarts_telefoonnummer');
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.huisarts);
  },
};