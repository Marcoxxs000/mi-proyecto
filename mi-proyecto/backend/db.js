// backend/db.js
require("dotenv").config();
const { Pool } = require("pg");

// La URL de la base de datos viene de tu archivo .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway.app')
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;
