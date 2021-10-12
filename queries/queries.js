const inquirer = require('inquirer');
const conTable = require("console.table");
const db = require('../db/path');

const departmentAdd = [{
    type: 'input',
    name: 'add_department',
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

function departmentList() {
    db.query("SELECT * FROM department", function (err, results) {
        if (err) {
            throw err;
        }
        console.table(result);
        init();
    })
}

function rolesList() {
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) {
            throw err;
        }
        init();
    })
}

function employeeList() {
    db.query("SELECT * FROM employee", function (err, results) {
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
            db.query(`INSERT INTO department(name) VALUES ("${response.add_department}")`, function (err, results) {
                if (err) {
                    throw err;
                }
                console.log((`Added ${response.department_name}`));
                init();
            })
        })
}

function addRole() {
    db.query("SELECT id, name FROM department", function (err, results) {
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
            })
        })
}

function updateRole() {

}


function quit() {
    process.exit();
}


module.exports = {
    quit,
    updateRole,
    addEmployee,
    addRole,
    addDepartment,
    employeeList,
    rolesList,
    departmentList,
};
