const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.leden).delete();
    await knex(tables.leden).insert([
      {id: 1,
        voornaam: "Senne",
        naam: "De Latter",
        afdeling: "keti",
        geboortedatum: new Date(2009,2,22),
        leiding_id: 3,
        huisarts_id : 1
      },
      {id: 2,
        voornaam: "Thor",
        naam: "De Bie",
        afdeling: "keti",
        geboortedatum: new Date(2009,12,10),
        leiding_id: 3,
        huisarts_id : 2
      },
      {id: 3,
        voornaam: "Lars",
        naam: "Van de Moortele",
        afdeling: "speelclub",
        geboortedatum: new Date(2015,6,6),
        leiding_id : 4,
        huisarts_id : 1
      }
     
    ]);
  },
};