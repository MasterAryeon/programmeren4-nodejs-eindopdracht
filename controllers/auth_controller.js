const assert = require('assert');
const chalk = require('chalk');
const sql = require('mssql');

const auth = require('../utils/auth/authentication');
const config = require('../config/config');
const ApiError = require('../errors/ApiError');


module.exports = {
    validateToken(request, response, next) {
        console.log(chalk.yellow('[TOKEN]    Validatie van token verzocht'));
        const token = request.header('x-access-token') || '';
        auth.decodeToken(token, (error, payload) => {
            if(error) {
                next(new ApiError(401, error.message));
            } else {
                console.log(chalk.green('[TOKEN]    Authentificatie gelukt van email: ' + payload.sub));
                next();
            }
        });
    },

    login(request, response, next) {
        try {
            const email = request.body.email || '';
            const password = request.body.password || '';

            assert(email !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(password !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(typeof(email) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(typeof(password) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));

                statement.prepare('EXEC loginAccount @email, @password;').then(s => {
                   s.execute({
                       email: email,
                       password: auth.hashPassword(password)
                   }).then(result => {
                       s.unprepare();

                       if(result.recordset[0].result === 1) {
                           const token = auth.encodeToken(email);
                           response.status(200).json({
                               token: token,
                               email: email
                           }).end();
                       } else {
                           console.log(chalk.red('[MSSQL]    Niet geautoriseerd (geen valid token) met email: ' + email));
                           next(new ApiError(401, 'Niet geautoriseerd (geen valid token)'));
                       }
                   }).catch( err => {
                   console.log(chalk.red('[MSSQL]    ' + err.message));
                   next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                   });
                }).catch(err => {
                    console.log(chalk.red('[MSSQL]    ' + err.message));
                    next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                });
            }).catch(err => {
                console.log(chalk.red('[MSSQL]    ' + err.message));
                next(new ApiError(500, 'Er is op dit moment geen verbinding met de database. Probeer het later opnieuw'));
            });
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },

    register(request, response, next) {
        try {
            const username = request.body.username || '';
            const password = request.body.password || '';
            const firstname = request.body.firstname || '';
            const lastname = request.body.lastname || '';

            assert(username !== '', 'Username was not defined or passed as empty');
            assert(password !== '', 'Password was not defined or passed as empty');
            assert(firstname !== '', 'Firstname was not defined or passed as empty');
            assert(lastname !== '', 'Lastname was not defined or passed as empty');

            assert(typeof(username) === 'string', 'Username is not of type string');
            assert(typeof(password) === 'string', 'Password is not of type string');
            assert(typeof(firstname) === 'string', 'Firstname is not of type string');
            assert(typeof(lastname) === 'string', 'Lastname is not of type string');

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const checkStatement = new sql.PreparedStatement(connection);
                checkStatement.input('username', sql.NVarChar(30));
                checkStatement.prepare('SELECT * FROM account WHERE username = @username;').then(cs => {
                    cs.execute({
                        username: username
                    }).then(result => {
                        cs.unprepare();
                        if(result.recordset.length === 0) {
                            const insertStatement = new sql.PreparedStatement(connection);
                            insertStatement.input('username', sql.NVarChar(30));
                            insertStatement.input('password', sql.NVarChar(100));
                            insertStatement.input('firstname', sql.NVarChar(20));
                            insertStatement.input('lastname', sql.NVarChar(20));
                            insertStatement.prepare('INSERT INTO account (username, password, firstname, lastname, date_of_birth, date_of_creation) VALUES (@username, @password, @firstname, @lastname, GETDATE(), GETDATE());').then(is => {
                                is.execute({
                                    username: username,
                                    password: auth.hashPassword(password),
                                    firstname: firstname,
                                    lastname: lastname
                                }).then(result => {
                                    is.unprepare();
                                    console.log(chalk.green('[MSSQL1]    ' + 'Successfully created an account'));
                                    response.status(200).json({
                                        status: 200,
                                        message: 'Successfully created an account'
                                    }).end();
                                }).catch(err => {
                                    console.log(chalk.red('[MSSQL]    ' + err.message));
                                    response.status(500).json(new ApiError(500, 'An internal error occured. Please try again later')).end();
                                });
                            }).catch(err => {
                                console.log(chalk.red('[MSSQL]    ' + err.message));
                                response.status(500).json(new ApiError(500, 'An internal error occured. Please try again later')).end();
                            });
                        } else {
                            console.log(chalk.red('[MSSQL]    ' + 'An account with that username already exists'));
                            response.status(500).json(new ApiError(500, 'An account with that username already exists')).end();
                        }
                    }).catch(err => {
                        console.log(chalk.red('[MSSQL]    ' + err.message));
                        response.status(500).json(new ApiError(500, 'An internal error occured. Please try again later')).end();
                    });
                }).catch(err => {
                    console.log(chalk.red('[MSSQL]    ' + err.message));
                    response.status(500).json(new ApiError(500, 'An internal error occured. Please try again later')).end();
                });
            }).catch(err => {
                console.log(chalk.red('[MSSQL]    ' + err.message));
                response.status(500).json(new ApiError(500, 'Connection to the database has been lost. Please try again later')).end();
            });

        } catch(error) {
            next(new ApiError(500, error.message));
        }
    },

    hashPassword(request, response, next) {
        try {
            const password = request.body.password || '';

            assert(password !== '', 'Password was not defined or passed as empty');
            assert(typeof(password) === 'string', 'Password is not of type string');

            response.status(200).json({
                hash: auth.hashPassword(password)
            }).end();
        } catch(error) {
            next(new ApiError(500, error.message));
        }
    }
};