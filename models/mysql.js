import db from 'mysql';
import config from '../config.js';

let mysql = db.createConnection({
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.name,
  port: config.database.port,
});

export default class MySQL {
  /**
   * Establishes connection to the MySQL database.
   */
  static async connectToDatabase() {
    mysql.connect(function (err) {
      if (err) {
        console.error("Error connecting to database:", err);
        return;
      }
      console.log("✅ Connected to MySQL database");
    });
  }

  /**
   * Executes a SQL query with optional parameters.
   * @param {string} query - The SQL query string.
   * @param {Array} params - An array of values to be substituted in the query.
   * @returns {Promise<void>} - A Promise that resolves when the query is executed successfully.
   */
  static async executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      mysql.query(query, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  /**
   * Inserts values into the guilds table.
   * @param {Array} columns - Array of column names.
   * @param {Array} values - Array of values to insert.
   */
  static async insertIntoGuildTable(columns, values) {
    // Check if the values is an array
    if (!Array.isArray(values)) {
      throw new Error("Columns and values must be arrays");
    }

    // Check if the number of columns matches number of values
    if (columns.length !== values.length) {
      throw new Error("Number of columns must match number of values");
    }

    // Generate placeholders for values
    const placeholders = values.map(() => "(?)").join(",");

    // Construct the SQL query
    const query = `INSERT INTO guilds (${columns.join(
      ","
    )}) VALUES (${placeholders})`;

    // Execute the query.
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
    // Construct the SQL query
    const query = `INSERT INTO ${table} (${column}) VALUES (?)`;

    // Execute the query.
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
      // Construct the SQL query
      const query = `SELECT COUNT(*) AS count FROM guilds WHERE ${column} = ? AND guild_id = ${guildId}`;

      // Execute the SQL query
      mysql.query(query, [value], (error, results) => {
        if (error) {
          // Reject the Promise if an error occurs
          reject(error);
        } else {
          // Resolve the Promise with the result
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
    // Ensure that columns is an array
    if (!Array.isArray(columns)) {
      throw new Error("Columns must be an array");
    }

    // Construct the column definitions
    const columnDefinitions = columns.join(", ");

    // Construct the SQL query to create the table
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;

    // Execute the SQL query
    mysql.query(query, (error, results) => {
      if (error) {
        throw error;
      }
    });
  }

    /**
     * Inserts multiple rows into the specified table. If a row with the same primary key exists, it updates the values instead.
     * @param {string} table - Table name.
     * @param {string[]} columns - Array of column names.
     * @param {any[][]} values - Array of value arrays (each value array corresponds to a row).
     * @returns {Promise<boolean>} - True if rows were inserted or updated successfully, otherwise false.
     */
    static async bulkInsertOrUpdate(table, columns, values) {
      // Generate the INSERT INTO ... ON DUPLICATE KEY UPDATE query
      const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ? ON DUPLICATE KEY UPDATE ${columns.map(column => `${column}=VALUES(${column})`).join(', ')}`;

      try {
          // Execute the query with values array
          await mysql.query(query, [values]);
          return true;
      } catch (error) {
          console.error('Error bulk inserting or updating data:', error);
          return false;
      }
  }

  /**
   * Select a certain column in a table.
   * @param {string} table - The table you want to select from.
   * @param {array} columns - The columns you want to select from.
   */
  static async selectFrom(table, columns) {
    // Ensure that columns is an array
    if (!Array.isArray(columns)) {
      throw new Error("Values must be an array");
    }

    // Construct the SQL query to select columns from the table
    const columnDefinitions = columns.join(", ");
    // Construct the SQL query to select columns from the table
    const query = `SELECT ${columnDefinitions} FROM ${table}"}`;

    // Execute the SQL query
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
      // Construct the SQL query to select the specified column from the "guilds" table
      const query = `SELECT ${column} FROM guilds WHERE guild_id = ?`;

      // Execute the SQL query
      mysql.query(query, [guildId], (error, results) => {
        if (error) {
          // Reject the Promise if an error occurs
          reject(error);
        } else {
          if (results.length > 0) {
            // If results are found, extract the value of the specified column
            const value = results[0][column];
            resolve(value);
          } else {
            // If no results are found, resolve with null
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
  static async getValueFromColumn(table, column) {
    return new Promise((resolve, reject) => {
      const query = `SELECT ${column} FROM ${table} LIMIT 1`;
      mysql.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0][column]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  /**
   * Retrieves a specific value from a column in a table based on a condition on a second column.
   * @param {string} table - The name of the table.
   * @param {string} column - The name of the column to retrieve the value from.
   * @param {string} conditionColumn - The name of the second column to use as a condition.
   * @param {string} conditionValue - The value of the second column to use as a condition.
   * @returns {Promise<any>} - A Promise that resolves with the value from the specified column.
   */
  static async getValueFromTableWithCondition(
    table,
    column,
    conditionColumn,
    conditionValue
  ) {
    return new Promise((resolve, reject) => {
      const query = `SELECT ${column} FROM ${table} WHERE ${conditionColumn} = ? LIMIT 1`;
      mysql.query(query, [conditionValue], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0][column]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  /**
   * Updates a specific value in a column in a table based on a condition on a second column.
   * @param {string} table - The name of the table.
   * @param {string} column - The name of the column to update.
   * @param {any} newValue - The new value to set in the column.
   * @param {string} conditionColumn - The name of the second column to use as a condition.
   * @param {any} conditionValue - The value of the second column to use as a condition.
   * @returns {Promise<number>} - A Promise that resolves with the number of affected rows.
   */
  static async updateValueInTableWithCondition(
    table,
    column,
    newValue,
    conditionColumn,
    conditionValue
  ) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ${table} SET ${column} = ? WHERE ${conditionColumn} = ?`;
      mysql.query(query, [newValue, conditionValue], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }

  static async getColumnData(table, column) {
    return new Promise((resolve, reject) => {
      const query = `SELECT ${column} FROM ${table}`;
      mysql.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const data = results.map((row) => row[column]);
          resolve(data);
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
   * Updates a specific column with a new value in a table for all rows.
   * @param {string} table - The name of the table.
   * @param {string} column - The name of the column to update.
   * @param {any} newValue - The new value to set for the column.
   * @returns {Promise<number>} - A Promise that resolves with the number of affected rows.
   */
  static async updateColumnValue(table, column, newValue) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ${table} SET ${column} = ?`;
      mysql.query(query, [newValue], (error, results) => {
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
      await this.updateColumnValue(table, column, value);
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
   * Edit a specific column in a specific table.
   * @param {string} table - The table you want to modify the column.
   * @param {string} column - The column you want to modify.
   * @param {string} newValue - The new value to want to replace in a specific column.
   */
  static async editColumnValue(table, column, newValue) {
    const query = `UPDATE ${table} SET ${column} = ?`;

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

  /**
   * Inserts a row with user-defined data.
   * @param {string} table - The table to you want to insert the column from
   * @param {Array} data - The data you want to insert into the row (can be one value or more.)
   */
  static async insertRow(table, data) {
    const columns = Object.keys(data).join(",");
    const values = Object.values(data)
      .map((value) => `'${value}'`)
      .join(",");

    const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;

    await this.executeQuery(query);
  }

  /**
   * Deletes a specific row on a table.
   * @param {string} table - The table you want to delete from.
   * @param {string} column - The column you want to delete from.
   * @param {any} value - The value fromwhich you wat to delete from.
   */
  static async deleteRow(table, column, value) {
    const query = `DELETE FROM ${table} WHERE ${column} = ?`;
    await this.executeQuery(query, [value]);
  }
}
