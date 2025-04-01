const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.leden, (table) => {
      table.integer('leiding_id').unsigned().notNullable();
      table.foreign('leiding_id', 'fk_leden_leiding')
        .references(`${tables.leiding}.id`)
        .onDelete('CASCADE');
      table.integer('huisarts_id').unsigned().notNullable();
      table.foreign('huisarts_id', 'fk_leden_huisarts')
        .references(`${tables.huisarts}.id`)
        .onDelete('CASCADE')
    });
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.leden, (table) => {
      table.dropColumns('leiding_id');
      table.dropColumns('huisarts_id');
    });
  },
};
