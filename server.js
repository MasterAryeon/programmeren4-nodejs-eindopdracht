/*
    server.js   -   Main server file
    File that will serve as the main runnable file from which the server is running
 */

//
//  All the necessary inclusions
//
// Initiating all the neccessary modules
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const chalk = require('chalk');

// Include all config files
const config = require("./config/config");

//Include the routes
const auth_routes = require('./routes/auth_routes');
const error_routes = require('./routes/error_routes');
const PLACEHOLDER_routes = require('./routes/PLACEHOLDER_routes');

// Include necessary controllers
const AuthController = require('./controllers/auth_controller');
const ErrorController = require('./controllers/error_controller');
//----------------------------------------------------------------

//
//  Setting up all the necessary variables used by the express library
//
// Deeper initiation
const app = express();
const port = process.env.PORT || config.port;

// Tell the express system to use morgan and bodyparser
app.use(morgan('dev'));
app.use(bodyparser.json());
//----------------------------------------------------------------

//
//  All routing usages
//
// Parse all the requests for the authentication of the user and the validation of the tokens
app.use('/api', auth_routes);
app.all('*', AuthController.validateToken);

// Parse all the defined endpoints that are being provided by this server
app.use('/api', PLACEHOLDER_routes);

//Error handling - Endpoint handling routing and final error destination handling
app.use('*', error_routes);
app.use(ErrorController.errorHandling);
//----------------------------------------------------------------

//
//  Starting up the server on specified port
//
// Start the server on given port
app.listen(port, () => {
    console.log(chalk.green('[SERVER]   Server is running on port: ' + port));
});
//----------------------------------------------------------------

//
//  Exporting the server for testing purposes
//
module.exports = app;
//----------------------------------------------------------------