const db = require('mysql');
const config = require('../config.js');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.databaseName,
    port: config.database.port
});

class MySQL {
    static async insertIntoGuildTable(columns, values) {
        if (!Array.isArray(values)) {
            throw new Error('Columns and values must be arrays');
        }

        if (columns.lenth !== values.length) {
            throw new Error('Number of columns must match number of values');
        }

        const columnName = columns.join(',');
        const placeholders = values.map(() => '(?)').join(',');
        const query = `INSERT INTO guilds (${columnName}) VALUES (${placeholders})`;

        mysql.query(query, values, (error, results) => {
            if (error) {
                throw error;
            }

            console.log(`Inserted ${results.affectedRows} row(s)`);
        });
    }

    static async insertInto(table, column, value) {
        const query = (`INSERT INTO ${table} (${column}) VALUES (?)`);

        mysql.query(query, [value], (error, results) => {
            if (error) {
                throw error;
            }

            console.log(`Inserted ${results.affectedRows} row(s) into ${table}`);
        });
    }

    static async createTable(tableName, columns) {
        if (!Array.isArray(columns)) {
            throw new Error('Columns must be an array');
        }

        const columnDefinitions = columns.join(', ');
        const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;

        mysql.query(query, (error, results) => {
            if (error) {
                throw error;
            }

            console.log(`Table ${tableName} created successfully`);
        });
    }

    static async selectFrom(table, columns) {
        if (!Array.isArray(columns)) {
            throw new Error('Values must be an array');
        }

        const columnDefinitions = columns.join(', ');
        const query = `SELECT ${columnDefinitions} FROM ${table}"}`;

        mysql.query(query, (error, results) => {
            if (error) {
                throw error;
            }
        });
    }

    static async selectFromGuilds(columns) {
        if (!Array.isArray(columns)) {
            throw new Error('Values must be an array');
        }

        const columnDefinitions = columns.join(', ');
        const query = `SELECT ${columnDefinitions} FROM guilds`;

        mysql.query(query, (error, results) => {
            if (error) {
                throw error;
            }
        });
    }

    static async getGuildFromId(guildId, column, value) {
        const query = `SELECT ${guildId} FROM guilds WHERE ${column} = ?`;

        mysql.query(query, [value], (error, results) => {
            if (error) {
                throw error;
            }

            console.log(`Retrieved ${results.length} row(s) from guilds where ${column} = ${value}`);
            console.log(results);
        });
    }

    static async hasYesNoValue(table, column) {
        const query = `SELECT COUNT(*) AS count FROM ${table}, WHERE ${column} IN ('Yes', 'No')`

        return new Promise((resolve, reject) => {
            mysql.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const count = results[0].count;
                    resolve(count > 0);
                }
            });
        });
    }
}

module.exports = MySQL;