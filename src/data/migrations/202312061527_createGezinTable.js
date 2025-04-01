const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.gezin, (table) => {
      table.increments('id');

      table.integer("lid_id").unsigned();
      table.foreign("lid_id", "fk_lid_gezin").references(`${tables.leden}.id`).onDelete("CASCADE");

      table.integer('ouder_id').unsigned().notNullable();
      table.foreign('ouder_id', 'fk_gezin_ouder')
        .references(`${tables.ouders}.id`)
        .onDelete('CASCADE');
      
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.gezin);
  },
};