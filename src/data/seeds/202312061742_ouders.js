const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.ouders).delete();
    await knex(tables.ouders).insert([
      {id: 1,
        voornaam: "Lien",
        naam: "D'hondt",
        telefoonnummer: "04/94.67.65.07"
      },
      {id: 2,
        voornaam: "Frederick",
        naam: "De Latter",
        telefoonnummer: "04/76.73.70.30"
      },
      {id: 3,
        voornaam: "Centina",
        naam: "Van Dingenen",
        telefoonnummer: "04/73.79.40.35"
      },
      {id: 4,
        voornaam: "Jens",
        naam: "Vande Moortele",
        telefoonnummer: "04/87.33.89.01"
      }
     
    ]);
  },
};