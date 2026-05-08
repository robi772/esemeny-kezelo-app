// MySQL kapcsolat pool létrehozása
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_FELHASZNALO || 'root',
  password: process.env.DB_JELSZO || 'password',
  database: process.env.DB_NEV || 'esemeny_kezelo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
