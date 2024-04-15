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
            const query = `SELECT COUNT(*) AS count FROM guilds WHERE ${column} = ? AND guild_id = ${guildId}`;

            mysql.query(query, [value], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count > 0);
                }
            });
        });
    }

    /**
     * Checks if a value exists in a specific column of the guilds table.
     * @param {string} table - The table you want to check if a value exits.
     * @param {string} column - Column name to check.
     * @param {any} value - Value to check.
     * @returns {Promise<boolean>} - True if value exists, otherwise false.
     */
    static async valueExistsInColumn(table, column, value) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = ?`;

            mysql.query(query, [value], (error, results) => {
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
     * @param {array} columns - The columns you want to select from.
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
     * Get a column value from the "guilds" table.
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
     * @param {string} table - The table you want get data from.
     * @param {string} guildId - The specific guild ID to get data from.
     * @param {string} column - The column you want to get data from.
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
     * @param {string} name - The name of the column you want to create.
     * @param {string} value - The value that you want the column to contain.
     * @returns 
     */
    static async createGuildsColumn(name, value) {
        return new Promise((resolve, reject) => {
            const query = `ALTER TABLE guilds ADD COLUMN ${name} ${value}`;

            mysql.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /**
     * Creates a new column in a specific table.
     * @param {string} table - The table you want to insert the column into.
     * @param {string} columnName - The name of the column you want to create.
     * @param {string} columnValue - The value you want the column to have.
     * @returns 
     */
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

    /**
     * Returns a value if a column exists in a specific table.
     * @param {string} tableName 
     * @param {string} columnName 
     * @returns 
     */
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

    /**
     * Modifies a specific guild row with new column data within the "guilds" table.
     * @param {string} guildId - The specific guild ID you want the row to be modified.
     * @param {string} column - The column you want to modify the value of.
     * @param {string} newValue - The new value you want to modify.
     * @returns 
     */
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

    /**
     * Modifies a specific tables columns.
     * @param {string} table - The table to modify.
     * @param {string} guildId - The specific guild ID you want the row to be modified.
     * @param {string} column - The column you want to modify the value of. 
     * @param {string} newValue - The new value you want to modify.
     * @returns 
     */
    static async updateColumnValue(table, guildId, column, newValue) {
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
    
    /**
     * Inserts a single value into the specified column of a table if it doesn't already exist,
     * or updates the existing value if it does.
     * @param {string} table - Table name.
     * @param {string} column - Column name to check.
     * @param {any} value - Value to insert or update.
     * @returns {Promise<boolean>} - True if value was inserted or updated, otherwise false.
    */
    static async insertOrUpdateValue(table, column, value) {
        const valueExists = await this.valueExistsInColumn(table, column, value);

        if (!valueExists) {
            await this.insertInto(table, column, value);
            return true;
        } else {
            await this.updateColumnInfo(table, column, value);
            return true;
        }
    }

    /**
     * Inserts a single value into the specified column of a table if it doesn't already exist.
     * @param {string} table - Table name.
     * @param {string} column - Column name to check.
     * @param {any} value - Value to insert.
     * @returns {Promise<boolean>} - True if value was inserted, otherwise false.
     */
    static async insertValueIfNotExists(table, column, value) {
        const valueExists = await this.valueExistsInColumn(table, column, value);

        if (!valueExists) {
            await this.insertInto(table, column, value);
            return true;
        } 

        return false;
    }

    /**
     * Edit a specific column in the "guilds" table.
     * @param {string} guildId - The guild ID to be modified.
     * @param {string} column - The column you want to modify.
     * @param {string} newValue - The new value to want to replace in a specific column.
     */
    static async editColumnInGuilds(guildId, column, newValue) {
        const query = `UPDATE guilds SET ${column} = ? WHERE guild_id = ${guildId}`;

        mysql.query(query, [newValue], function (error, results) {
            if (error) {
                throw error;
            }
        });
    }

    /**
     * Determines if a specific table column has a "true" or "false" value.
     * @param {string} table 
     * @param {string} column 
     * @returns 
     */
    static async hasTrueFalseValue(table, column) {
        const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${column} = 'true'`;

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