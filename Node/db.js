const {Pool} = require('pg')

const pool=new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'pg',
    port: 5432, // PostgreSQL default port
  })

module.exports = pool