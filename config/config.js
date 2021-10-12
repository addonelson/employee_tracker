const mysql = require('mysql2');
require('dotenv').config();

const schemaDB = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASS,
        database: "company_db"
    },
    console.log(`Connected to the company_db database`)
);

module.exports = schemaDB;
