const assert = require('assert');
const chalk = require('chalk');
const sql = require('mssql');
const db = require('../config/db');

const auth = require('../utils/auth/authentication');
const config = require('../config/config');
const ApiError = require('../domain/ApiError');

const UserLogin = require('../domain/user_login_JSON');
const ValidToken = require('../domain/valid_token');
const UserRegister = require('../domain/user_register_JSON');

module.exports = {
    validateToken(request, response, next) {
        console.log(chalk.yellow('[TOKEN]    Validatie van token verzocht'));
        const token = request.header('x-access-token') || '';

        auth.decodeToken(token, (error, payload) => {
            if(error) {
                next(new ApiError(401, error.message));
            } else {
                request.header.tokenid = payload.sub;
                console.log(chalk.green('[TOKEN]    Authentificatie gelukt van email: ' + payload.email));
                next();
            }
        });
    },

    login(request, response, next) {
        try {
            const email = request.body.email || '';
            const password = request.body.password || '';

            const userlogin = new UserLogin(email, password);

            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));

                statement.prepare('EXEC loginAccount @email, @password;').then(s => {
                    s.execute({
                        email: userlogin.email,
                        password: auth.hashPassword(userlogin.password)
                    }).then(result => {
                        s.unprepare();

                        if(result.recordset[0].result === 1) {
                            const accountId = result.recordset[0].id;
                            const validtoken = new ValidToken(auth.encodeToken(accountId, userlogin.email), userlogin.email);

                            console.log(chalk.green('[MSSQL]    Account succesvol ingelogd met email: ' + userlogin.email));

                            response.status(200).json(validtoken).end();

                        } else {
                            console.log(chalk.red('[MSSQL]    Niet geautoriseerd (geen valid token) met email: ' + userlogin.email));
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

            /*const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(conn);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));

                statement.prepare('EXEC loginAccount @email, @password;').then(s => {
                   s.execute({
                       email: userlogin.email,
                       password: auth.hashPassword(userlogin.password)
                   }).then(result => {
                       s.unprepare();

                       if(result.recordset[0].result === 1) {
                           const accountId = result.recordset[0].id;
                           const validtoken = new ValidToken(auth.encodeToken(accountId, userlogin.email), userlogin.email);

                           console.log(chalk.green('[MSSQL]    Account succesvol ingelogd met email: ' + userlogin.email));

                           response.status(200).json(validtoken).end();

                       } else {
                           console.log(chalk.red('[MSSQL]    Niet geautoriseerd (geen valid token) met email: ' + userlogin.email));
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
            });*/
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },

    async register(request, response, next) {
        try {
            const email = request.body.email || '';
            const password = request.body.password || '';
            const firstname = request.body.firstname || '';
            const lastname = request.body.lastname || '';

            const userRegistration = new UserRegister(firstname, lastname, email, password);
            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));
                statement.input('firstname', sql.NVarChar(32));
                statement.input('lastname', sql.NVarChar(32));
                statement.prepare('EXEC registerAccount @email, @password, @firstname, @lastname;').then(s => {
                    s.execute({
                        email: userRegistration.email,
                        password: auth.hashPassword(userRegistration.password),
                        firstname: userRegistration.firstname,
                        lastname: userRegistration.lastname
                    }).then(result => {
                        s.unprepare();
                        if(result.recordset[0].result === 1) {
                            const accountId = result.recordset[0].id;
                            const validtoken = new ValidToken(auth.encodeToken(accountId, userRegistration.email), userRegistration.email);
                            console.log(chalk.green('[MSSQL]    Account succesvol geregistreerd met email: ' + userRegistration.email));

                            response.status(200).json(validtoken).end();
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

            /*const connection = new sql.ConnectionPool(config.sql);
            connection.connect().then(conn => {

                const statement = new sql.PreparedStatement(connection);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));
                statement.input('firstname', sql.NVarChar(32));
                statement.input('lastname', sql.NVarChar(32));
                statement.prepare('EXEC registerAccount @email, @password, @firstname, @lastname;').then(s => {
                    s.execute({
                        email: userRegistration.email,
                        password: auth.hashPassword(userRegistration.password),
                        firstname: userRegistration.firstname,
                        lastname: userRegistration.lastname
                    }).then(result => {
                        s.unprepare();
                        if(result.recordset[0].result === 1) {
                            const accountId = result.recordset[0].id;
                            const validtoken = new ValidToken(auth.encodeToken(accountId, userRegistration.email), userRegistration.email);
                            console.log(chalk.green('[MSSQL]    Account succesvol geregistreerd met email: ' + userRegistration.email));

                            response.status(200).json(validtoken).end();
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
            });*/
        } catch(error) {
            next(new ApiError(412, error.message));
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