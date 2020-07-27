const db = require( './connection.js' )

const orm = {
    selectAll: () => {
        return db.query(`
		SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, salary, CONCAT(m.first_name,' ',m.last_name) AS manager
		FROM employee e 
		LEFT JOIN employee m
		ON e.manager_id = m.id
		LEFT JOIN role r
		ON e.role_id = r.id
		LEFT JOIN department d
		ON r.department_id = d.id
		GROUP BY e.id`)
    },
    viewRole: () => {
        return db.query(`
		SELECT r.id, title, salary, name AS department 
		FROM role r
		LEFT JOIN department d
		ON r.department_id = d.id`)
    },
    viewTable: (table) => {
        return db.query(`SELECT * FROM ${table}`)
    },
    returnRoles: async () => {
        const roles = await db.query('SELECT title, id FROM role')
        return roles.map(data => ({name: data.title, value: data.id }))
    },
    insertOne: (data) => {
        return db.query('INSERT INTO employee SET ?', data)
    }

}

module.exports = orm

// CONCAT(first_name,' ',last_name) AS