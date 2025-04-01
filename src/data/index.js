const knex = require('knex');
const { getLogger } = require('../core/logging');
const { join } = require('path');
const config = require('config');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');

let knexInstance;

async function initializeData() {
  const logger = getLogger();
  logger.info('Initializing connection to the database');
    const knexOptions = {
    client: 'mysql2',
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      //   name: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    debug: isDevelopment,
    migrations: {
      tableName: 'knex_meta',
      directory: join('src','data','migrations'),
    },
    seeds: {
      directory: join('src', 'data', 'seeds'),
    }
  };
  


  knexInstance = knex(knexOptions);

  try {
    await knexInstance.raw('SELECT 1+1 AS result');
    await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
    await knexInstance.destroy();
    knexOptions.connection.database = DATABASE_NAME; 
    knexInstance = knex(knexOptions); 
    await knexInstance.raw('SELECT 1+1 AS result')
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error('Could not initialize the data layer');
  }

  //Run migrations
  try {
    await knexInstance.migrate.latest();
  } catch (error) {
    logger.error('Error while migrating the database', {
      error,
    });
    throw new Error('Migrations failed, check the logs');
  }
  logger.info('Succesfully connected to the database');

  if (isDevelopment) {
    try {
      await knexInstance.seed.run();
    } catch (error) {
      logger.error('Error while seeding database', {
        error,
      });
    }}

  return knexInstance;
}

function getKnex() {
  if (!knexInstance)
    throw new Error(
      'Please initialize the data layer before getting the Knex instance'
    );
  return knexInstance;
}

async function shutdownData() {
  const logger = getLogger();

  logger.info('Shutting down database connection');

  await knexInstance.destroy();
  knexInstance = null;

  logger.info('Database connection closed');
}

const tables = Object.freeze({
  leden: 'leden',
  ouders: 'ouders',
  gezin: 'gezin',
  leiding: 'leiding',
  huisarts: 'huisarts'
});


module.exports = {
  initializeData,
  getKnex,
  tables,
  shutdownData
};