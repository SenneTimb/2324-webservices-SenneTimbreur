const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.gezin).delete();
    await knex(tables.gezin).insert([
      {id: 1,
        lid_id:1,
        ouder_id:1,
      },
      {id: 2,
        lid_id:1,
        ouder_id:2,
      },
      {id: 3,
        lid_id:2,
        ouder_id:3,
      },
      
     
    ]);
  },
};