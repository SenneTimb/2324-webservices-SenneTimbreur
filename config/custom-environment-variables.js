module.exports = {
  env: 'NODE_ENV',
  port: 'PORT',
  database: {
    client: 'mysql2',
    name: 'DATABASE_NAME',
    host: 'DATABASE_HOST',
    port:'DATABASE_PORT',
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD'
  },
  jwt_secret: 'JWT_SECRET',
  enableSwagger: 'ENABLE_SWAGGER'
};

