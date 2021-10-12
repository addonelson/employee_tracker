const inquirer = require('inquirer');
const queries = require('./queries/queries');

const intialQuestion = [{
    type: 'list',
    name: 'new',
    message: "What would you like to do?",
    choices: ["View all employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
}];


console.log("Welcome to employee manager");

function init() {
    inquirer
        .prompt(intialQuestion)
        .then((response) => {
            if (response.new === "View all employees") {
                queries.employeeList();
            } else if (response.new === "Add Employee") {
                queries.addEmployee();
            } else if (response.new === "Update Employee Role") {
                queries.updateRole();
            } else if (response.new === "View All Roles") {
                queries.rolesList();
            } else if (response.new === "Add Role") {
                queries.addRole();
            } else if (response.new === "View All Departments") {
                queries.departmentList();
            } else if (response.new === "Add Department") {
                queries.addDepartment();
            } else {
                queries.quit();
            }
        })
}
init();