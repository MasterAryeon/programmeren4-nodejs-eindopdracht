const sql = require('mssql');
const config = require('./config');

module.exports = new Promise(function(resolve, reject) {
    try {
        const connection = new sql.ConnectionPool(config.sql);
        connection.on('error',() => {});
        connection.connect().then(() => {
            console.log('Connected');
            resolve(connection);
        }).catch(err => {
            console.log('Not Connected');
            reject(err)
        });
    } catch(err) {
        console.log(err)
        reject(err)
    }
});