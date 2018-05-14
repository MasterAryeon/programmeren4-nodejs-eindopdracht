const assert = require('assert');
const chalk = require('chalk');
const sql = require('mssql');

const auth = require('../utils/auth/authentication');
const config = require('../config/config');
const ApiError = require('../errors/ApiError');


module.exports = {
    validateToken(request, response, next) {
        console.log(chalk.yellow('[TOKEN]    Validation of token requested'));
        const token = request.header('x-access-token') || '';
        auth.decodeToken(token, (error, payload) => {
            if(error) {
                next(new ApiError(401, error.message));
            } else {
                console.log(chalk.green('[TOKEN]    Authenticated user: ' + payload.sub));
                next();
            }
        });
    },

    login(request, response, next) {
        try {
            const username = request.body.username || '';
            const password = request.body.password || '';

            assert(username !== '', 'Username was not defined or passed as empty');
            assert(password !== '', 'Password was not defined or passed as empty');
            assert(typeof(username) === 'string', 'Username is not of type string');
            assert(typeof(password) === 'string', 'Password is not of type string');

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(connection);
                statement.input('username', sql.NVarChar(30));
                statement.input('password', sql.NVarChar(100));

                statement.prepare('SELECT * FROM account WHERE username = @username AND password = @password;').then(s => {
                   s.execute({
                       username: username,
                       password: auth.hashPassword(password)
                   }).then(result => {
                       s.unprepare();

                       if(result.recordset.length > 0) {
                           console.log(chalk.green('[MSSQL]    Succesful login with username: ' + username));
                           const token = auth.encodeToken(username);

                           response.status(200).json({
                               status: 200,
                               message: 'Successfully logged in',
                               token: token
                           }).end();
                       } else {
                           console.log(chalk.red('[MSSQL]    Invalid Username/Password provided with username: ' + username));
                           response.status(500).json(new ApiError(500, 'Invalid Username/Password')).end();
                       }
                       }).catch( err => {
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

    register(request, response, next) {
        try {
            const email = request.body.email || '';
            const password = request.body.password || '';
            const firstname = request.body.firstname || '';
            const lastname = request.body.lastname || '';

            assert(email !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(password !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(firstname !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(lastname !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');

            assert(typeof(email) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(typeof(password) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(typeof(firstname) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
            assert(typeof(lastname) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');

            const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(connection);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));
                statement.input('firstname', sql.NVarChar(32));
                statement.input('lastname', sql.NVarChar(32));
                statement.prepare('EXEC registerAccount @email, @password, @firstname, @lastname;').then(s => {
                    s.execute({
                        email: email,
                        password: auth.hashPassword(password),
                        firstname: firstname,
                        lastname: lastname
                    }).then(result => {
                        s.unprepare();

                        if(result.recordset[0].result === 1) {
                            const token = auth.encodeToken(email);
                            response.status(200).json({
                                token: token,
                                email: email
                            }).end();
                        } else {
                            console.log(chalk.red('[MSSQL]    ' + 'Een gebruiker met dit email adres bestaat al.'));
                            next(new ApiError(406, 'Een gebruiker met dit email adres bestaat al.'));
                        }
                    }).catch(err => {
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