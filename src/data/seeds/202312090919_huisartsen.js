const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.huisarts).delete();
    await knex(tables.huisarts).insert([
      {id: 1,
        voornaam: "Tom",
        naam: "Smolders",
        telefoonnummer: "09/37.73.94.7"
      },
      {id: 2,
        voornaam: "Sven",
        naam: "Gehesquire",
        telefoonnummer: "09/34.83.13.4"
      },
     
    ]);
  },
};