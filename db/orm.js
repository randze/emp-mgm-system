const db = require( './connection.js' )

const orm = {
    selectAll: () => {
        return db.query(`
		SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, salary, CONCAT(m.first_name,' ',m.last_name) AS manager
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
        return db.query('SELECT * FROM ??', table)
    },
    returnRoles: async () => {
        const roles = await db.query('SELECT title, id FROM role')
        return roles.map(data => ({name: data.title, value: data.id }))
    },
    insertOne: (table, data) => {
        return db.query('INSERT INTO ?? SET ?', [table, data])
    },
    returnDepartment: async () => {
        const department = await db.query('SELECT name, id FROM department')
        return department.map(data => ({name: data.name, value: data.id }))
    },
    employeeNames: async () => {
        const names = await db.query('SELECT CONCAT(first_name," ",last_name) AS name, id FROM employee')
        return names.map(data => ({name: data.name, value: data.id }))
    },
    updateRole: (value, id) => {
        return db.query( 'UPDATE employee SET ? WHERE id=?', [ { role_id: value}, id ] )
    },
    updateManager: (value, id) => {
        return db.query( 'UPDATE employee SET ? WHERE id=?', [ { manager_id: value}, id ] )
    },
    deleteEmployee: (id) => {
        return db.query('DELETE FROM employee WHERE id=?', id)
    },
    deleteRole: async (id) => {
        await db.query( 'UPDATE employee SET ? WHERE role_id=?', [ { role_id: null}, id ] )
        return db.query('DELETE FROM role WHERE id=?', id)
    },
    deleteDepartment: async (id) => {
        // await db.query( 'UPDATE employee SET ? WHERE role_id=?', [ { role_id: null}, id ] )
        await db.query('DELETE FROM role WHERE department_id=?', id)
        return db.query('DELETE FROM department WHERE id=?', id)
    }
}

module.exports = orm