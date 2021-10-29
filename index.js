const inquirer = require('inquirer');
const queries = require('./queries/queries');

const intialQuestion = [{
    type: 'list',
    name: 'new',
    message: "What would you like to do?",
    choices: ["View all employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
}];



function init() {
    console.log("Welcome to employee manager");
    inquirer
        .prompt(intialQuestion)
        .then(async (response) => {
            if (response.new === "View all employees") {
                 await queries.employeeList();
            } else if (response.new === "Add Employee") {
                await queries.addEmployee();
            } else if (response.new === "Update Employee Role") {
                await queries.updateRole();
            } else if (response.new === "View All Roles") {
                await queries.rolesList();
            } else if (response.new === "Add Role") {
                await queries.addRole();
            } else if (response.new === "View All Departments") {
                await queries.departmentList();
            } else if (response.new === "Add Department") {
                await queries.addDepartment();
            } else {
                await queries.quit();
            }
            init();
        })
}
init();