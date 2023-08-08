require('dotenv').config()

/** @type {import ('sequelize').ConnectionOptions} */
const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || '12345',
  database: process.env.MYSQL_DB || 'serverless',
  dialect: 'mysql',
}

module.exports = config
