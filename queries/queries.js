const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();


function departmentList(){
    db.query("SELECT * FROM department", function (err, results){
        mysql.createConnection(
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
            console.table(results)
    })
}

function rolesList() {
    db.query("SELECT * FROM roles", function (err, results){
        console.table(results)
    })
}

function EmployeeList() {
    db.query("SELECT * FROM employee", function (err, results){
        console.table(results)
    })
}