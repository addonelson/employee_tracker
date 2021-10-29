const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "company_db"
    },
    console.log(`connected to the employee database`)
);

module.exports = db;