const chalk = require('chalk');
const sql = require('mssql');
const db = require('../config/db');

const auth = require('../utils/auth/authentication');
const ApiError = require('../domain/ApiError');

const UserLogin = require('../domain/user_login_JSON');
const ValidToken = require('../domain/valid_token');
const UserRegister = require('../domain/user_register_JSON');

module.exports = {
    // function used to validate the provided token
    validateToken(request, response, next) {
        console.log(chalk.yellow('[TOKEN]    Validatie van token verzocht'));
        const token = request.header('x-access-token') || '';
        // decode the token and process it
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
    // function used for logging in the user
    login(request, response, next) {
        try {
            //making constants with the email and password from the request's body
            const email = request.body.email || '';
            const password = request.body.password || '';

            //creating a login with the created email en login
            const userlogin = new UserLogin(email, password);

            // use the connection pool to execute the statement
            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));

                // prepare the statement
                statement.prepare('EXEC loginAccount @email, @password;').then(s => {
                    s.execute({
                        email: userlogin.email,
                        password: auth.hashPassword(userlogin.password)
                    }).then(result => {
                        s.unprepare();
                        // process the result
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
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },
    // function used to register a new account
    register(request, response, next) {
        try {
            const email = request.body.email || '';
            const password = request.body.password || '';
            const firstname = request.body.firstname || '';
            const lastname = request.body.lastname || '';

            // check the input values
            const userRegistration = new UserRegister(firstname, lastname, email, password);
            // use the connection pool to execute the statement
            db.then(conn => {
                // create the statement and bind values
                const statement = new sql.PreparedStatement(conn);
                statement.input('email', sql.NVarChar(32));
                statement.input('password', sql.NVarChar(100));
                statement.input('firstname', sql.NVarChar(32));
                statement.input('lastname', sql.NVarChar(32));

                // prepare the statement
                statement.prepare('EXEC registerAccount @email, @password, @firstname, @lastname;').then(s => { //preparing  a statements
                    s.execute({
                        email: userRegistration.email,
                        password: auth.hashPassword(userRegistration.password),
                        firstname: userRegistration.firstname,
                        lastname: userRegistration.lastname
                    }).then(result => {
                        s.unprepare();

                        // process the result
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
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },

    /*hashPassword(request, response, next) {
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
    }*/
};