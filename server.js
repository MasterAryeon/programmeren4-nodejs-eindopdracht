/*
    server.js   -   Main server file
 */

// Initiating all the neccessary variables
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');

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
    console.log('A ' + httpMethod + ' has been made at ' + requestUrl);

    next();
});

app.use('/api', PLACEHOLDER_routes);

//Error handling - No endpoint found
app.use('*', (req, res, next) => {
    let httpMethod = req.method; //Type of request
    let requestUrl = req.baseUrl; //URL of request
    console.log('A ' + httpMethod + ' has been made at ' + requestUrl);

    //Sending error info to the Final error Handler
    next('ERROR 404: Endpoint does not exist');
    });

//Final error Handler for for Next(Info)
app.use((err, req, res, next) => {
   console.log('FINAL ERROR HANDLER: An error occurred');
   console.log(err.toString());
   let requestUrl = req.baseUrl;

   //Creating a response for errors

    const error = {
        error: err.toString(),
        url: requestUrl
    };

    //Responding to the error
    res.status(500).json(error).end(); //STATUS CODE 500 GELDT NIET ALTIJD!
});

// Start the server on given port
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});