const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.leiding, (table) => {
      table.increments('id');
      table.string('naam', 255).notNullable();
      table.string('voornaam', 255).notNullable();
      table.string('afdeling', 255).notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.leiding);
  },
};