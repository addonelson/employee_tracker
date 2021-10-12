const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require('./config/config')

const intialQuestion = [{
    type: 'list',
    name: 'initial',
    message: "What would you like to do?",
    choices: ["View all employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit", "View All Employees"]
}]

const departmentAdd = [{
    type: 'input',
    name: 'add department',
    message: "What is the name of the department?",
    validate: input => {
        if (input) {
            return true;
        } else {
            console.log("Please enter a name.");
            return false;
        }
    }

}];
const roleAdd = [{
        type: 'input',
        name: 'role_name',
        message: "What is the name of the role?",
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter a role.");
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'role_salary',
        message: "What is the salary of the role?",
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter a salary.");
                return false;
            }
        }
    },
    {
        type: 'list',
        name: 'department_role',
        message: "Which department does the role belong to?",
        choices: ["Sales", "Engineering", "Finance", "Legal"]
    }
];

const employeeAdd = [{
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?",
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter a name.");
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?",
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter a name.");
                return false;
            }
        }
    },
    {
        type: 'list',
        name: 'employee_role',
        message: "What is the employee's role?",
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer"]
    },
    {
        type: 'input',
        name: 'employee_manager',
        message: "Who is the employee's manager?",
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter a name.");
                return false;
            }
        }
    }
];


function departmentList(){
    db.query("SELECT * FROM department", function (err, results){
        if (err) {
            throw err;
        } 
        init();   
    })      
}

function rolesList() {
    db.query("SELECT * FROM roles", function (err, results){
        if (err) {
            throw err;
        }
        init();
    })
}

function employeeList() {
    db.query("SELECT * FROM employee", function (err, results){
        if (err) {
            throw err;
        }
        init();
    })
}

function addDepartment() {
    inquirer
    .prompt(departmentAdd)
    .then((response) => {
        db.query(`INSERT INTO department(name) VALUES ("${response.departmentAdd}")`, function (err, results){
            if (err) {
                throw err;
            }
            console.log((`Added ${response.department_name}`));
            init();
        })
    })
}

function addRole(){
    db.query("SELECT id, name FROM department", function (err, results){
        if (err) {
            throw err;
        }
        inquirer
        .prompt(roleAdd)
        .then((response) => {
            db.query(`INSERT INTO _role (title, salary, department_id)
        VALUES ("${response.role_name}", "${response.role_salary}", "${response.department_role}");`,
         function (err, results) {
                if (err) {
                    console.log(err);
                }
                console.log(`${response.role_name} added to the database.`);
                init();
            })
        })
    })
    
}
function addEmployee() {
    inquirer
    .prompt(employeeAdd)
    .then((response) => {
        db.query(`
        INSERT INTO employee (first_name, last_name, employee_role, emplopyee_manager) 
        VALUES (${response.first_name}, ${response.last_name}, ${response.employee_role}, ${response.employee_manager}, ); 
        `, function (err, results) {
            if (err) {
                console.log(err);
            }
            init();
        }
        )
    })
}


function init() {
    console.log("Welcome to employee manager");
    inquirer
        .prompt(initialQuestion)
        .then((response) => {
            if (response.new === "View all employees") {
                employeeList();
            } else if (response.new === "Add Employee") {
                addEmployee();
            } else if (response.new === "Update Employee Role") {

            } else if (response.new === "View All Roles") {
                rolesList();
            } else if (response.new === "Add Role") {
                addRole();
            } else if (response.new === "View All Departments") {
                departmentList();
            } else if (response.new === "Add Department") {
                addDepartment();
            } else if (response.new === "Quit") {
                quit();
            }
        })
}

function quit() {
    process.exit();
}

init();