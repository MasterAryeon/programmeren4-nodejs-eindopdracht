// Include necessary modules
const sql = require('mssql');
const config = require('./config');

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
        console.log(err.message);
        sqlMessage = 'Could not connect to backend database';
    } else {
        console.log('Successfully connected to the database');
        sqlConnected = true;
        sqlMessage = 'Successfully connected to the database';
    }
});
// Export the connection pool
module.exports = connection;
