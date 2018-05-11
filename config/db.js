// Include necessary modules
const sql = require('mssql');
const config = require('./config');
const chalk = require('chalk');

// Initiate the connectionPool object with environment variables
const connection = new sql.ConnectionPool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

// Connect the pool and handle any errors occuring
connection.connect(err => {
    if(err) {
        console.log(chalk.red(err.message));
        sqlMessage = '[MSSQL]   Could not connect to backend database';

    } else {
        console.log(chalk.green('[MSSQL]    Successfully connected to the database'));
        sqlConnected = true;
        sqlMessage = 'Successfully connected to the database';
    }
});
// Export the connection pool
module.exports = connection;
