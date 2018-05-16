const sql = require('mssql');
const config = require('./config');
const chalk = require('chalk');

module.exports = new Promise(function(resolve, reject) {
    try {
        const connection = new sql.ConnectionPool(config.sql);
        connection.on('error',() => {});
        connection.connect().then(() => {
            console.log(chalk.green('[MSSQL]    Connected to the MSSQL server'));
            resolve(connection);
        }).catch(err => {
            console.log(chalk.red('[MSSQL]    ' + err));
            reject(err)
        });
    } catch(err) {
        console.log(err);
        reject(err)
    }
});