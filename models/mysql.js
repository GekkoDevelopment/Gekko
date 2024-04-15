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
    /**
    * Establishes connection to the MySQL database.
    */
    static async connectToDatabase() {
        mysql.connect(function(err) {
            if (err) {
                console.error('Error connecting to database:', err);
                return;
            }
            console.log('✅ Connected to MySQL database');
        });
    }

    /**
    * Inserts values into the guilds table.
    * @param {Array} columns - Array of column names.
    * @param {Array} values - Array of values to insert.
    */
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
        });
    }

    /**
     * Inserts a single value into a specified table and column.
     * @param {string} table - Table name.
     * @param {string} column - Column name.
     * @param {any} value - Value to insert.
     */
    static async insertInto(table, column, value) {
        const query = (`INSERT INTO ${table} (${column}) VALUES (?)`);

        mysql.query(query, [value], (error, results) => {
            if (error) {
                throw error;
            }
        });
    }

    /**
     * Checks if a value exists in a specific column of the guilds table.
     * @param {string} guildId - Guild ID.
     * @param {string} column - Column name to check.
     * @param {any} value - Value to check.
     * @returns {Promise<boolean>} - True if value exists, otherwise false.
     */
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

    /**
     * Creates a table in the database.
     * @param {string} tableName - The name of the table to insert into the database
     * @param {array} columns - The names of the columns to insert into the database
     */
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
        });
    }

    /**
     * Select a certain column in a table.
     * @param {string} table - The table you want to select from.
     * @param {array} columns - 
     */
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

    /**
     * Get a column value from the 'guilds" table.
     * @param {string} guildId - The guild id you want the column to be added to.
     * @param {string} column - The column name you want to insert.
     * @returns 
     */
    static async getColumnValuesWithGuildId(guildId, column) {
        return new Promise((resolve, reject) => {
            const query = `SELECT ${column} FROM guilds WHERE guild_id = ?`;

            mysql.query(query, [guildId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        const value = results[0][column];
                        resolve(value);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    /**
     * Get a column value from a specific table.
     * @param {string} table 
     * @param {string} guildId 
     * @param {string} column 
     * @returns 
     */
    static async getTableColumnData(table, guildId, column) {
        return new Promise((resolve, reject) => {
            const query = `SELECT ${column} FROM ${table} WHERE guild_id = ?`;

            mysql.query(query, [guildId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length > 0) {
                        const value = results[0][column];
                        resolve(value);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    /**
     * Creates a column in the "guilds" table.
     * @param {string} columnName 
     * @param {string} columnValue 
     * @returns 
     */
    static async createGuildsColumn(columnName, columnValue) {
        return new Promise((resolve, reject) => {
            const query = `ALTER TABLE guilds ADD COLUMN ${columnName} ${columnValue}`;

            mysql.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async createColumn(table, columnName, columnValue) {
        return new Promise((resolve, reject) => {
            const query = `ALTER ${table} guilds ADD COLUMN ${columnName} ${columnValue}`;

            mysql.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async columnExists(tableName, columnName) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? AND COLUMN_NAME = ?`;

            mysql.query(query, [tableName, columnName], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    // Check if any rows were returned
                    const count = results[0].count;
                    resolve(count > 0);
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

    static async updateTableColumnInfo(table, guildId, column, newValue) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE ${table} SET ${column} = ? WHERE guild_id = ?`;

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
        });
    }

    static async getGuildFromId(guildId, column, value) {
        const query = `SELECT ${guildId} FROM guilds WHERE ${column} = ?`;

        mysql.query(query, [value], (error, results) => {
            if (error) {
                throw error;
            }
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