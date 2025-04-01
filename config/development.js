const { jwt_secret } = require("./custom-environment-variables");

module.exports = {
  log: {
    level: 'silly',
    disabled: false,
  },
  cors: { 
    origins: ['http://localhost:5173'], 
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: 3306,
    name: 'project',
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
      issuer: 'http://localhost:9000',
      audience: 'http://localhost:5173',
    },
  },
  port: 9000,

};