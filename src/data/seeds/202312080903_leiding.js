const { tables } = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    await knex(tables.leiding).insert([
      {
        id: 1,
        voornaam: 'admin',
        naam: "admin",
        email: 'admin@gmail.com',
        afdeling: "pinkel",
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=4$91S7XK4RYosFpY6uZU9t7g$BJLRmq81TYsQA2e+cDmFCuwasSqGGkVl2yqCaJNW9cw',
        roles: JSON.stringify([Role.ADMIN, Role.USER]),
      },
      {
        id: 2,
        voornaam: "user",
        naam: "user",
        email: 'user@gmail.com',
        afdeling : "pinkel",
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=4$0Yq4yn89hHqa6f1KvPLn2A$Ezfle4PxZeEftp5jgrjqVE7bctxqeNoy/IA7j5UCQKo',
        roles: JSON.stringify([Role.USER]),
      },
      {
        id: 3,
        voornaam: "Senne",
        naam: "Timbreur",
        email: 'senne.timbreur@gmail.com',
        afdeling : "keti",
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=4$0Yq4yn89hHqa6f1KvPLn2A$Ezfle4PxZeEftp5jgrjqVE7bctxqeNoy/IA7j5UCQKo',
        roles: JSON.stringify([Role.USER], [Role.ADMIN]),
      },
      {
        id: 4,
        voornaam: "Kirsten",
        naam: "Ginneberge",
        email: 'kirsten.ginneberge@gmail.com',
        afdeling : "pinkel",
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=4$0Yq4yn89hHqa6f1KvPLn2A$Ezfle4PxZeEftp5jgrjqVE7bctxqeNoy/IA7j5UCQKo',
        roles: JSON.stringify([Role.USER]),
      },
    ]);
  },
};
