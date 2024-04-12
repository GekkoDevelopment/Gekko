const db = require('mysql');
const config = require('../config.js');

let mysql = db.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name,
    port: config.database.port
});

class MySQL {
    static async connectToDatabase() {
        mysql.connect(function(err) {
            if (err) {
                console.error('Error connecting to database:', err);
                return;
            }
            console.log('✅ Connected to MySQL database');
        });
    }

    static async insertIntoGuildTable(columns, values) {
        if (!Array.isArray(values)) {
            throw new Error('Columns and values must be arrays');
        }
    
        if (columns.length !== values.length) {
            throw new Error('Number of columns must match number of values');
        }
    
        const placeholders = values.map(() => '(?)').join(',');
    
        const query = `INSERT INTO guilds (${columns.join(',')}) VALUES (${placeholders})`;
    
        mysql.query(query, values.flat(), (error, results) => {
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

    static async valueExistsInGuildsColumn(guildId, column, value) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) AS count FROM guilds WHERE ${column} = ? AND guild_id = ?`;

            mysql.query(query, [value, guildId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count > 0);
                }
            });
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

    static async getColumnValuesWithGuildId(guildId, column) {
        return new Promise((resolve, reject) => {
            const query = `SELECT ${column} FROM guilds WHERE guild_id = ?`;

            mysql.query(query, [guildId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const values = results.map(row => row[column]);
                    resolve(values);
                }
            });
        });
    }

    static async updateColumnInfo(guildId, column, newValue) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE guilds SET ${column} = ? WHERE guild_id = ?`;

            mysql.query(query, [newValue, guildId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.affectedRows);
                }
            });
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

    static async editColumnInGuilds(guildId, column, newValue) {
        const query = `UPDATE guilds SET ${column} = ? WHERE guild_id = ${guildId}`;

        mysql.query(query, [newValue], function (error, results) {
            if (error) {
                throw error;
            }

            console.log(results);
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
        const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = 'Yes'`;

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