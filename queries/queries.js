const db = require('../db/path');
const inquirer = require('inquirer');
const conTable = require("console.table");

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

// Update Employee Role
const updateEmpRole = [
    {
        type: "list",
        name: "updateRole",
        message: "Which Employee would you like to update",
        choices: []
    },

    {
        type: "list",
        name: "updateRole2",
        message: "What is the Employee's new role",
        choices: []
    },
];

async function departmentList() {
    await db.promise().query('SELECT * FROM department').then(([rows, results]) => {
        console.table(rows);
    })
        .catch((error) => {
            console.log(error);
        })
};

async function rolesList() {
    await db.promise().query('SELECT * FROM _role').then(([rows, results]) => {
        console.table(rows);
    })
        .catch((error) => {
            console.log(error);
        })
};

async function employeeList() {
    await db.promise().query('SELECT * FROM employee').then(([rows, results]) => {
        console.table(rows);
    })
        .catch((error) => {
            console.log(error);
        })
};


 async function addDepartment() {
    await inquirer
        .prompt(departmentAdd)
        .then(async (response) => {
            console.log(response);
            // Query function to put user-supplied department into the department table
            await db.promise().query(`INSERT INTO department(name) VALUES ("${response.departmentAdd}")`).then(([rows, results]) => {
                console.log("Your department has been added to the database!")
            })
        })
        .catch((error) => {
            console.log(error);
        })
};

async function addRole() {
    // Sets the choices array in the addRoles question to empty
    roleAdd[2].choices = [];
    // Query to select both id and name column from department table
    await db.promise().query("SELECT id, name FROM department").then(async ([rows, results]) => {
        // Iterates over the array of results provided by the above query
        rows.forEach(department => {
            // Pushes a string, department.name, onto the addRole.choices array to populate with current data from db
            roleAdd[2].choices.push(department.name)
        })
        // Inquirer prompt to ask questions to user
        await inquirer
            .prompt(roleAdd)
            .then(async (response) => {
                // Creates addRoleId variable so that proper attribution to proper department can be done later
                let addRoleId = "";
                // Iterates, again, over the results array, this time checking that department.name matches the 
                // department selected by user
                rows.forEach(department => {
                    // If the above is true, addRoleId now has the value of that department's id
                    if (department.name === response.department_role) {
                        addRoleId = department.id;
                    }
                })
                // Query function to put information added into the role table
                await db.promise().query(`INSERT INTO _role(title, salary, department_id) VALUES ("${response.role_name}", ${response.role_salary}, ${addRoleId})`).then(([rows, results]) => {
                    console.log("Your role has been added to the database!")
                })
            });
    });
};

 async function addEmployee() {
    // const containing our join query. The query looks to get data with which to fill out the 
    // choices for the last two questions in the addEmployee inquirer prompt
    const roleJoin = `
    SELECT _role.id AS role_id, _role.title, managers.id, managers.first_name, managers.last_name
    FROM _role 
    LEFT JOIN (SELECT id, first_name, last_name, role_id
    FROM employee WHERE manager_id 
    IS NULL) AS managers ON _role.id = managers.role_id`;

    // Sets the choice arrays in the addEmployee inquirer prompt to empty sets 
    // (empManager always starts with none as the first option)
    employeeAdd[2].choices = [];
    employeeAdd[3].choices = ["None",];

    // Our actual query request from the information specified above
    await db.promise().query(roleJoin).then(async ([rows, results]) => {
        // Iterating over the results array sent back from our query
        rows.forEach(data => {
            // If the id column of the data returned, in this case manager_id from the employee table,
            // is not null, 
            if (data.id !== null) {
                employeeAdd[3].choices.push(`${data.first_name} ${data.last_name}`)
            }
            employeeAdd[2].choices.push(data.title);
        })

        await inquirer
            .prompt(employeeAdd)
            .then(async (response) => {
                let empRoleId = "";
                let empManId = "NULL";
                rows.forEach(data => {
                    if (data.title === response.employee_role) {
                        empRoleId = data.role_id;
                    }
                    if (`${data.first_name} ${data.last_name}` === response.employee_manager) {
                        empManId = data.id
                    }
                })
                console.log(empRoleId);
                console.log(empManId);
                await db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${response.first_name}", "${response.last_name}", ${empRoleId}, ${empManId})`).then(([rows, fields]) => {
                    console.log("Your employee has been added to the database!")
                })
                .catch((error) => {
                    console.log(error);
                })
                
            })
            .catch((error) => {
                console.log(error);
            })
    })
}


async function updateRole() {
    const employeeRoleTable = `
    SELECT employee.first_name, employee.last_name, employee.role_id, _role.title
    FROM employee 
    JOIN _role ON employee.role_id = _role.id`;

    updateEmpRole[0].choices = [];
    updateEmpRole[1].choices = [];

    await db.promise().query(employeeRoleTable).then(async ([rows, fields]) => {
        rows.forEach(data => {
            updateEmpRole[0].choices.push(`${data.first_name} ${data.last_name}`);
            updateEmpRole[1].choices.push(data.title);
        })

        await inquirer
            .prompt(updateEmpRole)
            .then(async (response) => {
                let empNewRoleId = "";
                rows.forEach(data => {
                    if (data.title === response.updateRole2) {
                        empNewRoleId = data.role_id;

                    }
                })

                const firstLast = response.updateRole.split(" ");

                await db.promise().query(`UPDATE employee SET role_id = ${empNewRoleId} WHERE employee.first_name = "${firstLast[0]}" AND employee.last_name = "${firstLast[1]}"`).then(([rows, fields]) => {
                    console.log("This employee's role has been updated!")
                })
                .catch((error) => {
                    console.log(error);
                })
            })
            .catch((error) => {
                console.log(error);
            })
    })
    .catch((error) => {
        console.log(error);
    })
}



function quit() {
    process.exit();
}


module.exports = {
    departmentList,
    rolesList,
    employeeList,
    updateRole,
    addEmployee,
    addRole,
    addDepartment,
    quit
};
