const { jwt_secret } = require("./custom-environment-variables");

module.exports = {
  log: {
    level: 'silly',
    disabled: true,
  },
  cors: { // 👈 1
    origins: ['http://localhost:5173'], // 👈 2
    maxAge: 3 * 60 * 60, // 👈 3
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'project_test',
    username: 'root',
    password: 'root',
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret: jwt_secret,
      expirationInterval: 60 * 60 * 1000, 
      issuer: 'project_Senne.hogent.be',
      audience: 'project_Senne.hogent.be',
    },
  },
  port: 9000,

};