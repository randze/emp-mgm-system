require('dotenv').config()
require('console.table')

const orm = require('./db/orm')
const inquirer = require('inquirer')
const clear = require('clear');
const db = require('./db/connection');

let run = true

clear()

console.log(`
	==================================================================
	 ______ __  __ _____  __  __  _____ __  __    _______     _______ 
	|  ____|  \\/  |  __ \\|  \\/  |/ ____|  \\/  |  / ____\\ \\   / / ____|
	| |__  | \\  / | |__) | \\  / | |  __| \\  / | | (___  \\ \\_/ | (___  
	|  __| | |\\/| |  ___/| |\\/| | | |_ | |\\/| |  \\___ \\  \\   / \\___ \\ 
	| |____| |  | | |_   | |  | | |__| | |  | |_ ____) |  | |  ____) |
	|______|_|  |_|_(_)  |_|  |_|\\_____|_|  |_(_|_____/   |_| |_____/ 

	==================================================================
`)

async function mainApp() {
    while (run === true) {
        let response = await inquirer.prompt([
            {
                type: 'list',
                message: 'What would you like to do?\n',
                name: 'action',
                choices: [
                    'View',
                    'Add',
                    'Update',
                    'Exit'
                ]
            },
            {
                type: 'list',
                message: 'What would you like to view?\n',
                name: 'view',
                when: response => response.action === 'View',
                choices: [
                    'Employee',
                    'Role',
                    'Department'
                ]
            },
            {
                type: 'list',
                message: 'What would you like to add?\n',
                name: 'add',
                when: response => response.action === 'Add',
                choices: [
                    'Employee',
                    'Role',
                    'Department'
                ]
            },
            {
                type: 'list',
                message: 'What would you like to update?\n',
                name: 'update',
                when: response => response.action === 'Update',
                choices: [
                    'Employee role',
                    'Employee manager'
                ]
            }
        ])
            .then(async response => {
                switch (response.action) {
                case 'View':
                    switch (response.view) {
                    case 'Employee':
                        await orm.selectAll()
                            .then(data => {
                                clear()
                                console.log('===============\n Employee List\n===============')
                                console.table(data)
                            })
                        break;
                    case 'Role':
                        await orm.viewRole()
                            .then(data => {
                                clear()
                                console.log('===========\n Role List\n===========')
                                console.table(data)
                            })
                        break;
                    case 'Department':
                        await orm.viewTable('department')
                            .then(data => {
                                clear()
                                console.log('=================\n Department List\n=================')
                                console.table(data)
                            })
                        break;
                    }
                    break;
                case 'Add':
                    switch (response.add) {
                    case 'Employee':
                        response = await inquirer.prompt([
                            {
                                type: 'input',
                                message: 'What is the first name of the employee?\n',
                                name: 'first_name'
                            },
                            {
                                type: 'input',
                                message: 'What is the last name of the employee?\n',
                                name: 'last_name'
                            },
                            {
                                message: 'Choose the employee\'s role:',
                                type: 'list',
                                name: 'role_id',
                                choices: () => {
                                    return orm.returnRoles()
                                },
                            },
                        ]).then(async response => {
                            await orm.insertOne('employee', response)
                            console.log('\n====================')
                            console.log('  Added employee !')
                            console.log('====================\n')
                        })
                        break;
                    case 'Role':
                        response = await inquirer.prompt([
                            {
                                type: 'input',
                                message: 'What is the name of the new role?\n',
                                name: 'title'
                            },
                            {
                                type: 'input',
                                message: 'What is the salary?\n',
                                name: 'salary'
                            },
                            {
                                message: 'Choose the department the role is part of:',
                                type: 'list',
                                name: 'department_id',
                                choices: () => {
                                    return orm.returnDepartment()
                                },
                            },
                        ]).then(async response => {
                            await orm.insertOne('role', response)
                            console.log('\n====================')
                            console.log('  Added role !')
                            console.log('====================\n')
                        })
                        break;
                    case 'Department':
                        response = await inquirer.prompt([
                            {
                                type: 'input',
                                message: 'What is the name of the new department?\n',
                                name: 'name'
                            },
                        ]).then(async response => {
                            await orm.insertOne('department', response)
                            console.log('\n====================')
                            console.log('  Added department !')
                            console.log('====================\n')
                        })
                        break;
                    }
                    break;
                case 'Update':
                    switch (response.update) {
                    case 'Employee role':
                        response = await inquirer.prompt([
                            {
                                type: 'list',
                                message: 'What is the name of the new role?\n',
                                name: 'id',
                                choices: () => {
                                    return orm.employeeNames()
                                },
                            },
                            {
                                message: 'Choose the new role for the employee:',
                                type: 'list',
                                name: 'role_id',
                                choices: () => {
                                    return orm.returnRoles()
                                },
                            }
                        ]).then(async response => {
                            await orm.updateRole(response.role_id, response.id)
                            console.log('\n==========================')
                            console.log('  Updated employee role !')
                            console.log('==========================\n')
                        })
                        break;
                    case 'Employee manager':
                        response = await inquirer.prompt([
                            {
                                type: 'list',
                                message: 'Who do you want to assign a new manager to?\n',
                                name: 'id',
                                choices: () => {
                                    return orm.employeeNames()
                                },
                            },
                            {
                                message: 'Choose the new manager for the employee:',
                                type: 'list',
                                name: 'manager_id',
                                choices: [{ name: 'No manager', value: null }].concat(
                                    await orm.employeeNames()
                                )
                            },
                        ]).then(async response => {
                            await orm.updateManager(response.manager_id, response.id)
                            console.log('\n=============================')
                            console.log('  Updated employee manager !')
                            console.log('=============================\n')
                        })
                        break;
                    }
                    break;
                case 'Exit':
                    console.log('Ending App...')
                    return run = false
                }
            })
    }
    process.exit()
}

mainApp()