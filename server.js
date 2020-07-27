require('dotenv').config()
require('console.table')

const orm = require('./db/orm')
const inquirer = require('inquirer')
const clear = require('clear');
const db = require('./db/connection');

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
    let response = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?\n',
            name: 'action',
            choices: [
                'View',
                'Add',
                'Update',
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
                            console.table(data)
                            mainApp()
                        })
                    break;
                case 'Role':
                    await orm.viewRole()
                        .then(data => {
                            clear()
                            console.table(data)
                            mainApp()
                        })
                    break;
                case 'Department':
                    await orm.viewTable('department')
                        .then(data => {
                            clear()
                            console.table(data)
                            mainApp()
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
                        await orm.insertOne(response)
                        console.log('Added employee !')
                    })
                    break;
                case 'Role':
                    break;
                case 'Department':
                    break;
                }
                break;
            case 'Update':
                console.log('Update')
                break;
            }
        })
}

mainApp()