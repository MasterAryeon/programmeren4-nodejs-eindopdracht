/*
    server.js   -   Main server file
 */

// Initiating all the neccessary variables
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const chalk = require('chalk');

// Include errors
const ApiError = require('./error/ApiError');

// Initializing the database connection
const sql = require('./config/db');

// Include all configs
const config = require("./config/config");

//Importing the other classes
const PLACEHOLDER_routes = require('./routes/PLACEHOLDER_routes');

// Deeper initiation
const app = express();
const port = process.env.PORT || config.port;

// Tell the express system to use morgan and bodyparser
app.use(morgan('dev'));
app.use(bodyparser.json());

//Parsing the request
app.use('*', (req, res, next) => {
    let httpMethod = req.method; //Type of request
    let requestUrl = req.baseUrl; //URL of request
    console.log(chalk.yellow('[REQUEST]  A ' + httpMethod + ' request has been made at ' + requestUrl));

    next();
});

app.use('/api', PLACEHOLDER_routes);

//Error handling - No endpoint found
app.use('*', (req, res, next) => {
    let httpMethod = req.method; //Type of request
    let requestUrl = req.baseUrl; //URL of request

    //Sending error info to the Final error Handler
    next(new ApiError(404, 'Endpoint could not be found'));
    });

//Final error Handler for for Next(Info)
app.use((err, req, res, next) => {
   console.log(chalk.red('[ERROR]    FINAL ERROR HANDLER ' + '(' + err.status + '): ' + err.message));

    //Responding to the error
    res.status(err.status).json(err).end(); //STATUS CODE 500 GELDT NIET ALTIJD!
});

// Start the server on given port
app.listen(port, () => {
    console.log(chalk.green('[SERVER]   Server is running on port: ' + port));
});