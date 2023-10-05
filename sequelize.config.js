require('dotenv').config()

/** @type {import ('sequelize').ConnectionOptions} */
const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USERNAME || 'root',
  password: process.env.POSTGRES_PASSWORD || '12345',
  database: process.env.POSTGRES_DB || 'tutoring_organization',
  dialect: 'postgres',
}

module.exports = config
